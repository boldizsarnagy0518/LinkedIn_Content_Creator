from pydantic import BaseModel, Field


class GeneratePostRequest(BaseModel):
    idea: str = Field(..., min_length=3, description="Raw content idea from the user")
    tone: str | None = Field(default=None, description="Optional tone override")
    target_audience: str | None = Field(default=None, description="Optional target audience")


class DraftResponse(BaseModel):
    hooks: list[str]
    post: str
    hashtags: list[str]
    first_comment: str | None = None
    model: str
    used_mock: bool = False


class HealthResponse(BaseModel):
    status: str
    service: str
