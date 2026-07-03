# API Contract: genomeai ↔ genome-engine

## Overview
- **genomeai** (PUBLIC) makes HTTP requests to **genome-engine** (PRIVATE) backend
- genomeai uses a **mock engine** for demo/community — no API calls needed
- Production builds call the real engine via API

---

## Endpoints

### POST /api/run
Run a genome on a task and get results.

**Request:**
```json
{
  "genome": {
    "reasoning": 50,
    "planning": 60,
    "verification": 45,
    "memory": 55,
    "creativity": 70,
    "precision": 48,
    "verbosity": 52,
    "risk": 40,
    "empathy": 65,
    "autonomy": 50
  },
  "task": "Explain photosynthesis in a way a 10-year-old would understand"
}
```

**Response:**
```json
{
  "result": "Photosynthesis is like...",
  "metrics": {
    "tokens": 127,
    "latencyMs": 1240,
    "costCents": 2
  },
  "trace": [
    {
      "kind": "reason",
      "title": "Breaking down the concept",
      "lines": ["Identified key concepts", "Chose analogies"]
    }
  ]
}
```

---

### POST /api/benchmark
Run a genome across multiple tasks and get performance metrics.

**Request:**
```json
{
  "genomeId": "gen_abc123",
  "tasks": ["task1", "task2", ...]
}
```

**Response:**
```json
{
  "results": [
    {
      "task": "task1",
      "score": 8.5,
      "metrics": { "tokens": 100, "latencyMs": 800, "costCents": 1 }
    }
  ],
  "summary": {
    "avgScore": 8.3,
    "totalCost": 15
  }
}
```

---

## Environment

**genomeai .env.local:**
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ENGINE_API_URL=https://engine.genomeai.space  # Optional: production engine
```

**genome-engine .env.production:**
```
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=...
```

---

## Behavior

- **If `VITE_ENGINE_API_URL` is set** → Call real backend
- **If not set** → Use mock engine (deterministic, no costs)
- **Demo environment** → Always use mock engine

This allows:
- Public repo users to run locally without credentials
- Internal testing with real backend
- Zero breaking changes between public and private repos
