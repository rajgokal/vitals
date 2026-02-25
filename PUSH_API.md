# Vitals Push API

Base URL: `https://vitals.rajgokal.com`

## Authentication

All POST endpoints require an agent API key via the middleware. The middleware sets `x-auth-type: agent` when a valid Bearer token is provided.

```
Authorization: Bearer <AGENT_API_KEY>
Content-Type: application/json
```

The `AGENT_API_KEY` is set as an environment variable on the Vercel deployment.

---

## Endpoints

### Profile

**POST /api/profile** — Set/replace the full profile

```bash
curl -X POST https://vitals.rajgokal.com/api/profile \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj Gokal",
    "dob": "1988-06-06",
    "age": 37,
    "sex": "Male",
    "conditions": ["ADHD"],
    "allergies": ["Penicillin"],
    "bodyMetrics": {
      "height": "5'\''11\"",
      "weight": "175 lbs",
      "bmi": 24.4,
      "bodyFat": 18.5
    },
    "geneticFlags": ["CYP2D6 Poor Metabolizer"],
    "updatedAt": "2026-02-24"
  }'
```

**GET /api/profile** — Returns profile or `null`

---

### Medications

**POST /api/medications** — Set/replace the full medications array

```bash
curl -X POST https://vitals.rajgokal.com/api/medications \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Vyvanse",
      "dosage": "40mg",
      "frequency": "Daily",
      "prescriber": "Dr. Smith",
      "startDate": "2025-01-15",
      "active": true,
      "notes": "Take in morning"
    },
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "startDate": "2024-06-01",
      "endDate": "2025-03-01",
      "active": false,
      "notes": "Discontinued — GI side effects"
    }
  ]'
```

**GET /api/medications** — Returns array or `null`

---

### Supplements

**POST /api/supplements** — Set/replace the full supplements array

```bash
curl -X POST https://vitals.rajgokal.com/api/supplements \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Vitamin D3",
      "dosage": "5000 IU",
      "frequency": "Daily",
      "reason": "Low serum levels",
      "active": true
    }
  ]'
```

**GET /api/supplements** — Returns array or `null`

---

### Lab Draws

**POST /api/labs** — Add or replace a lab draw (matched by date)

```bash
curl -X POST https://vitals.rajgokal.com/api/labs \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-02-10",
    "source": "Quest Diagnostics",
    "markers": [
      {
        "name": "TSH",
        "value": 2.5,
        "unit": "mIU/L",
        "referenceRange": { "low": 0.4, "high": 4.0 },
        "category": "Thyroid"
      },
      {
        "name": "Hemoglobin A1c",
        "value": 5.8,
        "unit": "%",
        "referenceRange": { "low": 4.0, "high": 5.6 },
        "flag": "high",
        "category": "Metabolic"
      }
    ]
  }'
```

**GET /api/labs** — Returns all draws. Query params:
- `?from=2025-01-01` — filter draws on/after date
- `?to=2026-01-01` — filter draws on/before date
- `?marker=TSH` — filter to draws containing marker (case-insensitive)

**GET /api/labs/[date]** — Returns single draw by date or 404

---

### Genetics

**POST /api/genetics** — Set/replace the full genetics panel

```bash
curl -X POST https://vitals.rajgokal.com/api/genetics \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "enzymes": [
      {
        "gene": "CYP2D6",
        "variant": "*4/*4",
        "metabolizerStatus": "Poor Metabolizer",
        "implications": "Reduced efficacy of codeine, tramadol"
      }
    ],
    "hlaTypes": [
      {
        "gene": "HLA-B",
        "variant": "*57:01",
        "risk": "Abacavir hypersensitivity"
      }
    ],
    "actionableFlags": ["Avoid codeine", "Abacavir contraindicated"],
    "updatedAt": "2026-01-15"
  }'
```

**GET /api/genetics** — Returns panel or `null`

---

### Interactions

**POST /api/interactions** — Set/replace interactions watchlist

```bash
curl -X POST https://vitals.rajgokal.com/api/interactions \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "drug1": "Vyvanse",
      "drug2": "Sertraline",
      "severity": "medium",
      "description": "May increase serotonin levels",
      "recommendation": "Monitor for serotonin syndrome symptoms"
    }
  ]'
```

**GET /api/interactions** — Returns array or `null`

---

### Providers

**POST /api/providers** — Set/replace providers list

```bash
curl -X POST https://vitals.rajgokal.com/api/providers \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Dr. Sarah Chen",
      "specialty": "Internal Medicine",
      "facility": "Austin Health Partners",
      "phone": "(512) 555-0100",
      "email": "schen@ahp.com",
      "lastVisit": "2026-01-20"
    }
  ]'
```

**GET /api/providers** — Returns array or `[]`

---

### Encounters

**POST /api/encounters** — Append a single encounter

```bash
curl -X POST https://vitals.rajgokal.com/api/encounters \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-02-15",
    "provider": "Dr. Sarah Chen",
    "type": "Annual Physical",
    "summary": "Routine checkup. All vitals normal. Ordered standard bloodwork."
  }'
```

**GET /api/encounters** — Returns array or `[]`

---

### Immunizations

**POST /api/immunizations** — Set/replace immunizations array

```bash
curl -X POST https://vitals.rajgokal.com/api/immunizations \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "COVID-19 Booster (Moderna)",
      "date": "2025-10-15",
      "provider": "CVS Pharmacy",
      "lot": "ABC12345"
    }
  ]'
```

**GET /api/immunizations** — Returns array or `null`

---

## Type Reference

All types are defined in `src/lib/types.ts`. Key notes:

- **LabMarker.value**: `number | string` — numeric for trend tracking, string for qualitative results
- **LabMarker.flag**: `"high" | "low" | "critical"` — optional, drives UI highlighting
- **LabMarker.referenceRange**: `{ low?: number, high?: number, text?: string }` — numeric bounds for sparkline reference bands
- **Medication.active**: `boolean` — determines current vs historical display
- **Interaction.severity**: `"high" | "medium" | "low"`
- **LabDraw POST**: Upserts by date — same date replaces existing draw
- **Encounters POST**: Appends (does not replace)
- **All other POST**: Replaces entire dataset

---

## Wearables (v0.3 — Postgres-backed)

All wearable endpoints use Vercel Postgres (Neon). Requires `POSTGRES_URL` env var.

### Migration

**POST /api/wearables/migrate** — Create tables (idempotent, agent key only)

```bash
curl -X POST https://vitals.rajgokal.com/api/wearables/migrate \
  -H "Authorization: Bearer $AGENT_API_KEY"
```

### Sleep

**POST /api/wearables/sleep** — Bulk upsert sleep records (agent key only)

```bash
curl -X POST https://vitals.rajgokal.com/api/wearables/sleep \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"records":[{
    "source":"oura","date":"2026-02-20","total_sleep_minutes":420,
    "deep_sleep_minutes":90,"rem_sleep_minutes":110,"light_sleep_minutes":200,
    "awake_minutes":20,"sleep_score":85,"efficiency":92.5,
    "hr_lowest":48,"hr_average":55,"hrv_average":45,"breath_average":14.5,
    "temperature_delta":0.1
  }]}'
```

**GET /api/wearables/sleep?from=&to=&limit=&page=** — Paginated sleep data

### Readiness

**POST /api/wearables/readiness** — Bulk upsert readiness records

```bash
curl -X POST https://vitals.rajgokal.com/api/wearables/readiness \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"records":[{
    "source":"oura","date":"2026-02-20","score":82,
    "temperature_deviation":0.05,"resting_heart_rate":52,"hrv_balance":45
  }]}'
```

**GET /api/wearables/readiness?from=&to=&limit=&page=**

### Activity

**POST /api/wearables/activity** — Bulk upsert activity records

```bash
curl -X POST https://vitals.rajgokal.com/api/wearables/activity \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"records":[{
    "source":"oura","date":"2026-02-20","score":78,
    "steps":8500,"active_calories":350,"total_calories":2200,
    "sedentary_minutes":600,"low_activity_minutes":120,
    "medium_activity_minutes":45,"high_activity_minutes":30
  }]}'
```

**GET /api/wearables/activity?from=&to=&limit=&page=**

### Heart Rate

**POST /api/wearables/heart-rate** — Bulk insert HR records (batches of 500)

```bash
curl -X POST https://vitals.rajgokal.com/api/wearables/heart-rate \
  -H "Authorization: Bearer $AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"records":[
    {"source":"oura","timestamp":"2026-02-20T03:00:00","bpm":52},
    {"source":"oura","timestamp":"2026-02-20T03:05:00","bpm":54}
  ]}'
```

**GET /api/wearables/heart-rate?from=&to=&resolution=daily|hourly|raw&limit=**

### Stress

**POST /api/wearables/stress** — Bulk upsert stress records

**GET /api/wearables/stress?from=&to=&limit=&page=**

### Summary

**GET /api/wearables/summary** — Latest scores + 7d/30d averages (no auth needed beyond session)

---

## Notes

- All dates should be ISO format: `YYYY-MM-DD`
- The middleware checks the Bearer token and sets `x-auth-type: agent` for authorized requests
- Rate limiting is handled by Vercel's infrastructure
- Max payload size is limited by Vercel's default (4.5MB)
