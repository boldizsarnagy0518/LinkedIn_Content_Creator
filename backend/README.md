# Python Backend

This folder contains the FastAPI backend for LinkedIn Content Creator.

The backend is responsible for:

- receiving rough content ideas,
- building the LinkedIn generation prompt,
- calling Gemini when configured,
- returning structured post drafts,
- falling back to mock generation when no model key is configured.

## Setup

From the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

Windows PowerShell:

```bash
.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Run the API

```bash
uvicorn app.main:app --reload --port 8000
```

Health check:

```text
http://localhost:8000/health
```

Interactive API docs:

```text
http://localhost:8000/docs
```

## Optional model configuration

The backend works without model configuration because it has a mock fallback.

To use Gemini, create a local `.env` file inside the `backend` folder and add your Google AI Studio key using the variable expected in `app/config.py`.

Do not commit local `.env` files.

## API endpoints

### `GET /health`

Returns service status.

### `POST /generate`

Request body:

```json
{
  "idea": "I want to write about why reliable data pipelines matter more than trendy tools.",
  "tone": "personal, concise, professional",
  "target_audience": "data engineers and analytics professionals"
}
```

Response body:

```json
{
  "hooks": ["hook 1", "hook 2", "hook 3"],
  "post": "final LinkedIn post",
  "hashtags": ["DataEngineering", "Analytics"],
  "first_comment": "optional first comment",
  "model": "model-name",
  "used_mock": false
}
```

## Why Python backend?

The project keeps Next.js for the frontend and uses Python for AI/backend logic because:

- the owner is stronger in Python,
- Python is a natural fit for AI workflows,
- later LangGraph integration will be easier,
- future data and vector memory logic will fit well into this backend.
