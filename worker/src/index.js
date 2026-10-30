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

async function askGemini(data, env) {
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
      input: buildPrompt(data),
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
    if (url.pathname !== "/analyze" || request.method !== "POST") {
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
    const data = validatePayload(parsed);
    if (!data) return jsonResponse({ error: "Dati allenamento non validi" }, 400, origin);
    if (!env.GEMINI_API_KEY) return jsonResponse({ error: "AI non configurata" }, 503, origin);

    const hash = await sha256(JSON.stringify(data));
    const cacheKey = new Request(`https://tracker-fitness-ai-cache.internal/${hash}`);
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return jsonResponse({ ...(await cached.json()), cached: true }, 200, origin);

    try {
      const result = await askGemini(data, env);
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
