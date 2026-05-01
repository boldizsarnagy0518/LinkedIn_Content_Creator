from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models import DraftResponse, GeneratePostRequest, HealthResponse
from app.services import generate_draft

app = FastAPI(
    title="LinkedIn Content Creator API",
    description="Python backend for AI-powered LinkedIn content generation.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", service="linkedin-content-creator-api")


@app.post("/generate", response_model=DraftResponse)
async def generate(request: GeneratePostRequest) -> DraftResponse:
    return await generate_draft(request)
