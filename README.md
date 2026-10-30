# Trackerfitness

Web app pubblicata su GitHub Pages con backend AI isolato in Cloudflare Workers.

## SYSTEM AI COACH

Il frontend invia esclusivamente le ultime 4–6 sessioni dell'esercizio al Worker
`tracker-fitness-ai`. La chiave Gemini resta nel secret Cloudflare
`GEMINI_API_KEY` e non viene mai inclusa nei file pubblici.

Il Worker si trova in `worker/` e include validazione dei dati, CORS limitato al
dominio GitHub Pages, rate limiting, cache delle analisi e test automatici.

```bash
cd worker
npm install
npm test
npx wrangler deploy
```

Il frontend mantiene sempre un'analisi locale come fallback quando Gemini non è
disponibile o lo storico contiene meno di quattro sessioni.
