const ALLOWED_ORIGIN = "https://sitowebsicilia.github.io";
const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const MAX_BODY_BYTES = 24_000;
const CACHE_SECONDS = 21_600;

function corsHeaders(origin) {
  return origin === ALLOWED_ORIGIN ? {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-Client-Id",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  } : {};
}

function jsonResponse(body, status, origin, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(origin),
      ...extraHeaders
    }
  });
}

function finiteNumber(value, min, max, allowNull = false) {
  if ((value === null || value === "" || value === undefined) && allowNull) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : undefined;
}

export function validatePayload(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  if (typeof input.exercise !== "string" || input.exercise.trim().length < 2 || input.exercise.length > 100) return null;
  if (!Array.isArray(input.sessions) || input.sessions.length < 4 || input.sessions.length > 6) return null;

  const sessions = [];
  for (const session of input.sessions) {
    if (!session || typeof session !== "object" || !/^\d{4}-\d{2}-\d{2}$/.test(session.date || "")) return null;
    if (!Array.isArray(session.sets) || session.sets.length < 1 || session.sets.length > 12) return null;
    const sets = [];
    for (const set of session.sets) {
      if (!set || typeof set !== "object") return null;
      const kg = finiteNumber(set.kg, 0, 1000, true);
      const reps = finiteNumber(set.reps, 0, 1000, true);
      const rir = finiteNumber(set.rir, 0, 10, true);
      if (kg === undefined || reps === undefined || rir === undefined) return null;
      const note = typeof set.note === "string" ? set.note.trim().slice(0, 180) : "";
      sets.push({ kg, reps, rir, note });
    }
    sessions.push({ date: session.date, sets });
  }
  return { version: 1, exercise: input.exercise.trim(), sessions };
}

export function validateOverviewPayload(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const question = typeof input.question === "string" ? input.question.trim().slice(0, 300) : "";
  const history = input.history;
  if (!history || typeof history !== "object" || Array.isArray(history)) return null;
  const totalSessions = finiteNumber(history.totalSessions, 0, 5000);
  if (totalSessions === undefined) return null;
  const firstDate = /^\d{4}-\d{2}-\d{2}$/.test(history.firstDate || "") ? history.firstDate : null;
  const lastDate = /^\d{4}-\d{2}-\d{2}$/.test(history.lastDate || "") ? history.lastDate : null;
  const workoutCounts = {};
  if (!history.workoutCounts || typeof history.workoutCounts !== "object" || Array.isArray(history.workoutCounts)) return null;
  for (const [name, count] of Object.entries(history.workoutCounts).slice(0, 12)) {
    const safeCount = finiteNumber(count, 0, 5000);
    if (name.length > 40 || safeCount === undefined) return null;
    workoutCounts[name] = safeCount;
  }
  if (!Array.isArray(history.exercises) || history.exercises.length > 40) return null;
  const exercises = [];
  for (const exercise of history.exercises) {
    if (!exercise || typeof exercise.name !== "string" || exercise.name.trim().length < 2 || exercise.name.length > 100) return null;
    const sessions = finiteNumber(exercise.sessions, 1, 5000);
    if (sessions === undefined || !Array.isArray(exercise.recent) || exercise.recent.length > 4) return null;
    const recent = exercise.recent.map(item => {
      if (!item || !/^\d{4}-\d{2}-\d{2}$/.test(item.date || "")) return null;
      const bestKg = finiteNumber(item.bestKg, 0, 1000, true);
      const bestReps = finiteNumber(item.bestReps, 0, 1000, true);
      const avgRir = finiteNumber(item.avgRir, 0, 10, true);
      if (bestKg === undefined || bestReps === undefined || avgRir === undefined) return null;
      return { date: item.date, bestKg, bestReps, avgRir };
    });
    if (recent.includes(null)) return null;
    exercises.push({ name: exercise.name.trim(), sessions, recent });
  }
  let nutritionSummary = null;
  if (history.nutritionSummary && typeof history.nutritionSummary === "object") {
    const values = ["days", "avgKcal", "avgProtein", "avgCarbs", "avgFat"].map(key => finiteNumber(history.nutritionSummary[key], 0, 10000));
    if (values.includes(undefined)) return null;
    nutritionSummary = Object.fromEntries(["days", "avgKcal", "avgProtein", "avgCarbs", "avgFat"].map((key, index) => [key, values[index]]));
  }
  let weightSummary = null;
  if (history.weightSummary && typeof history.weightSummary === "object") {
    const entries = finiteNumber(history.weightSummary.entries, 0, 5000);
    const latest = finiteNumber(history.weightSummary.latest, 20, 500, true);
    const earliest = finiteNumber(history.weightSummary.earliest, 20, 500, true);
    if (entries === undefined || latest === undefined || earliest === undefined) return null;
    weightSummary = { entries, latest, earliest };
  }
  return { version: 1, question, history: { totalSessions, firstDate, lastDate, workoutCounts, exercises, nutritionSummary, weightSummary } };
}

export function validateNutritionPayload(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  if (typeof input.text !== "string" || input.text.trim().length < 3 || input.text.length > 600) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date || "")) return null;
  const knownFoods = Array.isArray(input.knownFoods)
    ? [...new Set(input.knownFoods.filter(name => typeof name === "string").map(name => name.trim().slice(0, 100)).filter(Boolean))].slice(0, 120)
    : [];
  return { version: 1, text: input.text.trim(), date: input.date, knownFoods };
}

function outputIsValid(value) {
  return value && typeof value === "object" &&
    ["miglioramento", "stabile", "margine_rir", "stallo", "dati_insufficienti"].includes(value.status) &&
    typeof value.summary === "string" && value.summary.length <= 500 &&
    Array.isArray(value.insights) && value.insights.length >= 1 && value.insights.length <= 4 &&
    value.insights.every(item => typeof item === "string" && item.length <= 260) &&
    typeof value.recommendation === "string" && value.recommendation.length <= 500;
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function buildPrompt(data) {
  return `Sei SYSTEM AI COACH, un assistente prudente per l'analisi della performance in palestra.
Analizza esclusivamente i dati forniti delle ultime ${data.sessions.length} sessioni di ${data.exercise}.
Confronta kg, ripetizioni, RIR, andamento e possibili stalli. Distingui miglioramento reale, prestazione stabile e stesso rendimento con maggiore margine RIR.
Non suggerire automaticamente di aumentare il carico. Proponi un aumento solo se i dati lo giustificano chiaramente; altrimenti consiglia conferma, tecnica, ripetizioni o recupero.
Non formulare diagnosi mediche. Sii concreto, breve e scrivi in italiano.
Rispondi esclusivamente con JSON valido, senza markdown, nel formato:
{"status":"miglioramento|stabile|margine_rir|stallo|dati_insufficienti","summary":"...","insights":["..."],"recommendation":"..."}
Dati, dal meno recente al più recente:
${JSON.stringify(data.sessions)}`;
}

function buildOverviewPrompt(data) {
  const request = data.question
    ? `Rispondi prima a questa domanda dell'utente: ${data.question}`
    : "Fornisci una panoramica generale dello storico e indica le priorità più utili per le prossime sessioni.";
  return `Sei SYSTEM AI COACH, un assistente prudente per l'analisi dello storico di allenamento.
${request}
Analizza frequenza, distribuzione degli allenamenti, kg, ripetizioni, RIR, nutrizione media e andamento del peso usando solo il riepilogo fornito.
Individua eventuali correlazioni tra alimentazione, peso e prestazioni, ma non presentarle mai come cause certe.
Puoi suggerire di valutare una modifica calorica, ma non dichiarare che l'obiettivo sia stato modificato: ogni modifica richiede conferma esplicita dell'utente.
Non suggerire automaticamente aumenti di carico. Non inventare dati e non formulare diagnosi mediche.
Se una conclusione non è supportata dallo storico, dichiaralo chiaramente. Scrivi in italiano in modo concreto e breve.
Rispondi esclusivamente con JSON valido, senza markdown, nel formato:
{"status":"miglioramento|stabile|margine_rir|stallo|dati_insufficienti","summary":"...","insights":["..."],"recommendation":"..."}
Riepilogo completo disponibile nell'app:
${JSON.stringify(data.history)}`;
}

function buildNutritionPrompt(data) {
  return `Sei SYSTEM NUTRITION AI. Interpreta il comando alimentare. Non calcolare calorie o macronutrienti: li calcolerà il codice.
Prima uniforma il nome con l'archivio. Se il piatto non è nell'archivio ed è regionale, tradizionale, casalingo o composto, riconoscilo e descrivi una ricetta tipica usando ESCLUSIVAMENTE ingredienti presenti nell'archivio.
Per una ricetta indica i grammi realistici di ogni ingrediente nella porzione consumata, includendo condimenti, panatura e olio assorbito quando pertinenti. Sono ipotesi modificabili, non dati certi.
Se l'utente non indica il peso, proponi una porzione tipica in suggestedServingGrams e non fare domande. Chiedi un dettaglio soltanto se senza di esso non puoi identificare il piatto o la variante cambia radicalmente la stima.
Se indica un numero di pezzi, mantieni unit=piece e proponi suggestedUnitGrams per il peso edibile di un pezzo.
La data selezionata è ${data.date}. I pasti ammessi sono breakfast, lunch, dinner, snacks.
Azioni ammesse: add, copy_previous, update_quantity, delete.
Per "stessa colazione di ieri" usa copy_previous. Per correzioni usa update_quantity. Se il pasto non è specificato, usa snacks.
Unità ammesse: g, ml, piece. Stato ammesso: raw, cooked, unspecified.
Rispondi esclusivamente con JSON valido, senza markdown:
{"action":"add|copy_previous|update_quantity|delete","meal":"breakfast|lunch|dinner|snacks","items":[{"name":"...","quantity":0,"unit":"g|ml|piece","state":"raw|cooked|unspecified","recognition":"catalog|recipe_estimate","suggestedServingGrams":0,"suggestedUnitGrams":0,"ingredients":[{"name":"nome esatto archivio","grams":0}],"assumptions":["ipotesi breve"]}],"targetName":"","needsClarification":false,"question":""}
Per un alimento semplice o già archiviato usa recognition=catalog, ingredients=[] e valori suggeriti a 0. Per un piatto composto sconosciuto usa recipe_estimate, almeno 2 ingredienti e almeno una ipotesi.
Imposta needsClarification=true e una sola domanda breve solo quando il dettaglio è davvero indispensabile.
Alimenti già presenti nell'archivio personale o interno (usali per uniformare i nomi quando la corrispondenza è evidente): ${JSON.stringify(data.knownFoods)}
Comando: ${data.text}`;
}

function nutritionOutputIsValid(value) {
  return value && typeof value === "object" &&
    ["add", "copy_previous", "update_quantity", "delete"].includes(value.action) &&
    ["breakfast", "lunch", "dinner", "snacks"].includes(value.meal) &&
    Array.isArray(value.items) && value.items.length <= 12 && value.items.every(item =>
      item && typeof item.name === "string" && item.name.trim().length >= 1 && item.name.length <= 100 &&
      Number.isFinite(Number(item.quantity)) && Number(item.quantity) >= 0 && Number(item.quantity) <= 5000 &&
      ["g", "ml", "piece"].includes(item.unit) && ["raw", "cooked", "unspecified"].includes(item.state) &&
      ["catalog", "recipe_estimate"].includes(item.recognition || "catalog") &&
      finiteNumber(item.suggestedServingGrams || 0, 0, 5000) !== undefined &&
      finiteNumber(item.suggestedUnitGrams || 0, 0, 2000) !== undefined &&
      Array.isArray(item.ingredients || []) && (item.ingredients || []).length <= 20 &&
      (item.ingredients || []).every(ingredient => ingredient && typeof ingredient.name === "string" && ingredient.name.trim().length > 0 && ingredient.name.length <= 100 && finiteNumber(ingredient.grams, 0.1, 5000) !== undefined) &&
      Array.isArray(item.assumptions || []) && (item.assumptions || []).length <= 8 && (item.assumptions || []).every(note => typeof note === "string" && note.length <= 180)) &&
    typeof value.needsClarification === "boolean" && typeof (value.question || "") === "string" && (value.question || "").length <= 240;
}

async function askGemini(data, env, prompt = buildPrompt(data)) {
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/interactions";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      model,
      input: prompt,
      generation_config: { thinking_level: "low", temperature: 0.2, max_output_tokens: 500 }
    }),
    signal: AbortSignal.timeout(25_000)
  });

  if (!response.ok) {
    const detail = (await response.text()).replace(/\s+/g, " ").slice(0, 500);
    throw new Error(`Gemini ${response.status}: ${detail}`);
  }
  const result = await response.json();
  const text = result?.steps?.find(step => step?.type === "model_output")?.content?.find(item => item?.type === "text")?.text ||
    result?.outputs?.find(item => typeof item?.text === "string")?.text ||
    result?.output?.text || result?.text ||
    result?.candidates?.[0]?.content?.parts?.find(part => typeof part.text === "string")?.text;
  if (!text) throw new Error("Risposta Gemini vuota");
  const analysis = JSON.parse(text.replace(/^```json\s*|\s*```$/g, "").trim());
  if (!outputIsValid(analysis)) throw new Error("Risposta Gemini non valida");
  return { analysis, model };
}

async function askGeminiNutrition(data, env) {
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({ model, input: buildNutritionPrompt(data), generation_config: { thinking_level: "low", temperature: 0, max_output_tokens: 700 } }),
    signal: AbortSignal.timeout(25_000)
  });
  if (!response.ok) throw new Error(`Gemini Nutrition ${response.status}: ${(await response.text()).replace(/\s+/g, " ").slice(0, 500)}`);
  const result = await response.json();
  const text = result?.steps?.find(step => step?.type === "model_output")?.content?.find(item => item?.type === "text")?.text;
  if (!text) throw new Error("Risposta Nutrition AI vuota");
  const interpretation = JSON.parse(text.replace(/^```json\s*|\s*```$/g, "").trim());
  if (!nutritionOutputIsValid(interpretation)) throw new Error("Risposta Nutrition AI non valida");
  interpretation.items = interpretation.items.map(item => ({
    ...item,
    name: item.name.trim(),
    quantity: Number(item.quantity),
    recognition: item.recognition || "catalog",
    suggestedServingGrams: Number(item.suggestedServingGrams) || 0,
    suggestedUnitGrams: Number(item.suggestedUnitGrams) || 0,
    ingredients: (item.ingredients || []).map(ingredient => ({ name: ingredient.name.trim(), grams: Number(ingredient.grams) })),
    assumptions: (item.assumptions || []).map(note => note.trim()).filter(Boolean)
  }));
  interpretation.items = interpretation.items.map(item => {
    if (item.recognition !== "recipe_estimate" || item.unit !== "piece" || item.quantity <= 0 || item.suggestedUnitGrams <= 0 || !item.ingredients.length) return item;
    const expectedGrams = item.quantity * item.suggestedUnitGrams;
    const ingredientGrams = item.ingredients.reduce((sum, ingredient) => sum + ingredient.grams, 0);
    if (ingredientGrams >= expectedGrams * 0.75 || ingredientGrams <= 0) return item;
    const scale = expectedGrams / ingredientGrams;
    return {
      ...item,
      ingredients: item.ingredients.map(ingredient => ({ ...ingredient, grams: Math.round(ingredient.grams * scale * 10) / 10 })),
      assumptions: [...item.assumptions, `Ingredienti proporzionati a ${item.quantity} pezzi da circa ${item.suggestedUnitGrams} g ciascuno.`].slice(0, 8)
    };
  });
  interpretation.targetName = typeof interpretation.targetName === "string" ? interpretation.targetName.trim().slice(0, 100) : "";
  interpretation.question = (interpretation.question || "").trim();
  return { interpretation, model };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return jsonResponse({ ok: true, service: "tracker-fitness-ai" }, 200, origin);
    }
    if (request.method === "OPTIONS") {
      return origin === ALLOWED_ORIGIN
        ? new Response(null, { status: 204, headers: corsHeaders(origin) })
        : jsonResponse({ error: "Origin non consentita" }, 403, origin);
    }
    if (!['/analyze', '/coach', '/nutrition/parse'].includes(url.pathname) || request.method !== "POST") {
      return jsonResponse({ error: "Endpoint non trovato" }, 404, origin);
    }
    if (origin !== ALLOWED_ORIGIN) return jsonResponse({ error: "Origin non consentita" }, 403, origin);
    if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
      return jsonResponse({ error: "Content-Type non valido" }, 415, origin);
    }
    const declaredLength = Number(request.headers.get("Content-Length") || 0);
    if (declaredLength > MAX_BODY_BYTES) return jsonResponse({ error: "Richiesta troppo grande" }, 413, origin);

    const clientId = request.headers.get("X-Client-Id") || "";
    if (!/^[A-Za-z0-9_-]{16,80}$/.test(clientId)) return jsonResponse({ error: "Client non valido" }, 400, origin);
    if (env.AI_RATE_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const limited = await env.AI_RATE_LIMITER.limit({ key: `${clientId}:${ip}` });
      if (!limited.success) return jsonResponse({ error: "Troppe richieste. Riprova tra un minuto." }, 429, origin, { "Retry-After": "60" });
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return jsonResponse({ error: "Richiesta troppo grande" }, 413, origin);
    let parsed;
    try { parsed = JSON.parse(rawBody); } catch { return jsonResponse({ error: "JSON non valido" }, 400, origin); }
    const isOverview = url.pathname === "/coach";
    const isNutrition = url.pathname === "/nutrition/parse";
    const data = isNutrition ? validateNutritionPayload(parsed) : isOverview ? validateOverviewPayload(parsed) : validatePayload(parsed);
    if (!data) return jsonResponse({ error: "Dati non validi" }, 400, origin);
    if (!env.GEMINI_API_KEY) return jsonResponse({ error: "AI non configurata" }, 503, origin);

    const hash = await sha256(JSON.stringify(data));
    const cacheKey = new Request(`https://tracker-fitness-ai-cache.internal/${hash}`);
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return jsonResponse({ ...(await cached.json()), cached: true }, 200, origin);

    try {
      if (isNutrition) {
        const result = await askGeminiNutrition(data, env);
        const payload = { source: "gemini", model: result.model, interpretation: result.interpretation };
        await cache.put(cacheKey, new Response(JSON.stringify(payload), { headers: { "Content-Type": "application/json", "Cache-Control": `public, max-age=${CACHE_SECONDS}` } }));
        return jsonResponse(payload, 200, origin);
      }
      const result = await askGemini(data, env, isOverview ? buildOverviewPrompt(data) : buildPrompt(data));
      const payload = { source: "gemini", model: result.model, analysis: result.analysis };
      const cacheResponse = new Response(JSON.stringify(payload), {
        headers: { "Content-Type": "application/json", "Cache-Control": `public, max-age=${CACHE_SECONDS}` }
      });
      await cache.put(cacheKey, cacheResponse);
      return jsonResponse(payload, 200, origin);
    } catch (error) {
      console.error("Gemini request failed", error?.message || error);
      return jsonResponse({ error: "AI temporaneamente non disponibile" }, 502, origin);
    }
  }
};
