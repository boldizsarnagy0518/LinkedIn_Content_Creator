# Phase 2 — Python Backend and LLM Integration

Phase 2 introduces a Python FastAPI backend between the Next.js frontend and the AI generation layer.

## Why this direction?

The frontend remains in Next.js because it is strong for building a clean interactive web app.

The AI and workflow logic moves toward Python because:

- Python is the user's strongest language,
- FastAPI is simple and production-friendly,
- future LangGraph integration is more natural in Python,
- future data processing, embeddings, and memory features are easier to maintain in Python,
- this architecture is stronger for a Data Engineering / AI portfolio project.

## Current architecture

```text
Next.js UI
  -> Next.js /api/generate route
  -> Python FastAPI /generate endpoint
  -> Gemini service or mock fallback
```

The Next.js API route acts as a proxy. This keeps the frontend simple and prevents browser-side model calls.

## Fallback behavior

The app is intentionally resilient during development.

```text
If Python backend is running:
  use Python /generate

If Python backend is not running:
  use local TypeScript mock fallback

If Gemini is not configured inside Python:
  use Python mock fallback
```

This means the UI can always be tested.

## Added files

```text
backend/
  app/
    __init__.py
    config.py
    main.py
    models.py
    prompts.py
    services.py
  requirements.txt
  README.md
```

## Backend endpoints

### Health check

```text
GET /health
```

### Generate post draft

```text
POST /generate
```

Input:

```json
{
  "idea": "rough post idea",
  "tone": "optional tone",
  "target_audience": "optional audience"
}
```

Output:

```json
{
  "hooks": ["hook 1", "hook 2", "hook 3"],
  "post": "final LinkedIn post",
  "hashtags": ["DataEngineering", "AI"],
  "first_comment": "optional first comment",
  "model": "model-name",
  "used_mock": false
}
```

## Local development

Terminal 1 — frontend:

```bash
npm run dev
```

Terminal 2 — backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open:

```text
http://localhost:3000
```

Backend docs:

```text
http://localhost:8000/docs
```

## Next steps

1. Test frontend with backend mock response.
2. Add local backend environment config.
3. Configure Gemini locally.
4. Improve JSON parsing and validation.
5. Add revision endpoint.
6. Add Supabase persistence.
7. Add LangGraph workflow.
