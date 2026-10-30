import test from "node:test";
import assert from "node:assert/strict";
import worker, { validateNutritionPayload, validateOverviewPayload, validatePayload } from "../src/index.js";

const validPayload = {
  exercise: "Lat Machine triangolo",
  sessions: ["2026-09-01", "2026-09-08", "2026-09-15", "2026-09-22"].map((date, index) => ({
    date,
    sets: [{ kg: 60 + index, reps: 8, rir: 1, note: "" }]
  }))
};

test("accetta 4-6 sessioni valide e rimuove i campi extra", () => {
  const result = validatePayload({ ...validPayload, ignored: "value" });
  assert.equal(result.exercise, "Lat Machine triangolo");
  assert.equal(result.sessions.length, 4);
  assert.deepEqual(Object.keys(result.sessions[0].sets[0]), ["kg", "reps", "rir", "note"]);
});

test("rifiuta meno di quattro sessioni", () => {
  assert.equal(validatePayload({ ...validPayload, sessions: validPayload.sessions.slice(0, 3) }), null);
});

test("rifiuta valori fuori intervallo", () => {
  const payload = structuredClone(validPayload);
  payload.sessions[0].sets[0].rir = 20;
  assert.equal(validatePayload(payload), null);
});

test("valida il riepilogo dello storico generale", () => {
  const result = validateOverviewPayload({
    question: "Come sta andando il Pull?",
    history: {
      totalSessions: 12,
      firstDate: "2026-09-01",
      lastDate: "2026-10-20",
      workoutCounts: { PULL: 4, PUSH: 4, "FULL BODY": 4 },
      exercises: [{ name: "Lat Machine", sessions: 4, recent: [{ date: "2026-10-20", bestKg: 60, bestReps: 8, avgRir: 1 }] }]
    }
  });
  assert.equal(result.question, "Come sta andando il Pull?");
  assert.equal(result.history.totalSessions, 12);
});

test("valida e limita il comando Nutrition AI", () => {
  const result = validateNutritionPayload({
    text: "A pranzo 120 g di riso basmati e 200 g di merluzzo",
    date: "2026-10-30",
    knownFoods: ["Riso basmati", "Merluzzo", 42]
  });
  assert.equal(result.date, "2026-10-30");
  assert.deepEqual(result.knownFoods, ["Riso basmati", "Merluzzo"]);
  assert.equal(validateNutritionPayload({ text: "x", date: "ieri" }), null);
});

test("blocca origini diverse da GitHub Pages", async () => {
  const request = new Request("https://worker.example/analyze", {
    method: "POST",
    headers: { Origin: "https://example.com", "Content-Type": "application/json" },
    body: JSON.stringify(validPayload)
  });
  const response = await worker.fetch(request, {});
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
});

test("inoltra a Gemini una richiesta valida e restituisce l'analisi", async () => {
  const originalFetch = globalThis.fetch;
  const originalCaches = globalThis.caches;
  globalThis.caches = { default: { match: async () => null, put: async () => undefined } };
  globalThis.fetch = async () => new Response(JSON.stringify({
    steps: [{ type: "model_output", content: [{ type: "text", text: JSON.stringify({
        status: "stabile",
        summary: "Prestazione stabile nelle ultime sessioni.",
        insights: ["Carico e ripetizioni sono coerenti."],
        recommendation: "Conferma tecnica e recupero nella prossima sessione."
      }) }] }]
  }), { status: 200, headers: { "Content-Type": "application/json" } });

  try {
    const request = new Request("https://worker.example/analyze", {
      method: "POST",
      headers: {
        Origin: "https://sitowebsicilia.github.io",
        "Content-Type": "application/json",
        "X-Client-Id": "test_client_123456789"
      },
      body: JSON.stringify(validPayload)
    });
    const response = await worker.fetch(request, { GEMINI_API_KEY: "test", AI_RATE_LIMITER: { limit: async () => ({ success: true }) } });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://sitowebsicilia.github.io");
    assert.equal(result.source, "gemini");
    assert.equal(result.analysis.status, "stabile");
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.caches = originalCaches;
  }
});

test("interpreta un pasto senza affidare i macro a Gemini", async () => {
  const originalFetch = globalThis.fetch;
  const originalCaches = globalThis.caches;
  globalThis.caches = { default: { match: async () => null, put: async () => undefined } };
  globalThis.fetch = async () => new Response(JSON.stringify({
    steps: [{ type: "model_output", content: [{ type: "text", text: JSON.stringify({
      action: "add",
      meal: "lunch",
      items: [{ name: "Riso basmati", quantity: 120, unit: "g", state: "raw" }],
      targetName: "",
      needsClarification: false,
      question: ""
    }) }] }]
  }), { status: 200, headers: { "Content-Type": "application/json" } });
  try {
    const response = await worker.fetch(new Request("https://worker.example/nutrition/parse", {
      method: "POST",
      headers: { Origin: "https://sitowebsicilia.github.io", "Content-Type": "application/json", "X-Client-Id": "nutrition_test_123456" },
      body: JSON.stringify({ text: "A pranzo 120 g di riso basmati", date: "2026-10-30", knownFoods: ["Riso basmati"] })
    }), { GEMINI_API_KEY: "test", AI_RATE_LIMITER: { limit: async () => ({ success: true }) } });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.interpretation.items[0].quantity, 120);
    assert.equal("kcal" in result.interpretation.items[0], false);
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.caches = originalCaches;
  }
});
