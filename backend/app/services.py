import json
import re

import google.generativeai as genai

from app.config import settings
from app.models import DraftResponse, GeneratePostRequest
from app.prompts import build_generation_prompt


def create_mock_draft(request: GeneratePostRequest) -> DraftResponse:
    return DraftResponse(
        hooks=[
            "The hardest part of building data systems is not choosing the tool.",
            "Consistency in data engineering usually comes from boring decisions.",
            "A small workflow improvement can be more valuable than a new framework.",
        ],
        post=(
            "One thing I keep noticing in data engineering: the tool is rarely the whole story.\n\n"
            "A good pipeline is not only about using the newest technology. It is about making data reliable, "
            "understandable, and easy to use for the people who depend on it.\n\n"
            "That often means simple things:\n"
            "- clear ownership\n"
            "- predictable transformations\n"
            "- good naming\n"
            "- useful logs\n"
            "- checks that fail early\n\n"
            f"My rough idea for this post was:\n\n\"{request.idea}\"\n\n"
            "The more I work with data workflows, the more I appreciate systems that are boring in the best possible way: "
            "stable, transparent, and easy to debug."
        ),
        hashtags=["DataEngineering", "Analytics", "AIWorkflows"],
        first_comment="Curious how others think about this: what makes a data workflow feel reliable to you?",
        model="mock-local-fallback",
        used_mock=True,
    )


def _extract_json(text: str) -> dict:
    cleaned = text.strip()
    cleaned = re.sub(r"^```json", "", cleaned, flags=re.IGNORECASE).strip()
    cleaned = re.sub(r"^```", "", cleaned).strip()
    cleaned = re.sub(r"```$", "", cleaned).strip()
    return json.loads(cleaned)


def _parse_draft_response(raw_text: str, model_name: str) -> DraftResponse:
    parsed = _extract_json(raw_text)
    return DraftResponse(
        hooks=parsed.get("hooks", [])[:3],
        post=parsed.get("post", ""),
        hashtags=parsed.get("hashtags", []),
        first_comment=parsed.get("first_comment"),
        model=model_name,
        used_mock=False,
    )


async def generate_draft(request: GeneratePostRequest) -> DraftResponse:
    if not settings.google_api_key:
        return create_mock_draft(request)

    try:
        genai.configure(api_key=settings.google_api_key)
        model = genai.GenerativeModel(settings.gemini_model)
        prompt = build_generation_prompt(
            idea=request.idea,
            tone=request.tone,
            target_audience=request.target_audience,
        )
        response = model.generate_content(prompt)
        return _parse_draft_response(response.text, settings.gemini_model)
    except Exception:
        if settings.allow_mock_fallback:
            return create_mock_draft(request)
        raise
