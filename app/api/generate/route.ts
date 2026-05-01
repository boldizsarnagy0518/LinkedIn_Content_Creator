import { NextResponse } from "next/server";
import { createMockDraft } from "@/lib/mock-draft";

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL ?? "http://localhost:8000";

function normalizeBackendResponse(data: Record<string, unknown>) {
  return {
    hooks: data.hooks,
    post: data.post,
    hashtags: data.hashtags,
    firstComment: data.first_comment ?? data.firstComment,
    model: data.model,
    usedMock: data.used_mock ?? data.usedMock ?? false
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { idea?: string; tone?: string; targetAudience?: string };
    const idea = body.idea?.trim();

    if (!idea) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
    }

    try {
      const backendResponse = await fetch(`${PYTHON_BACKEND_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          tone: body.tone,
          target_audience: body.targetAudience
        })
      });

      if (backendResponse.ok) {
        const backendData = (await backendResponse.json()) as Record<string, unknown>;
        return NextResponse.json(normalizeBackendResponse(backendData));
      }
    } catch (backendError) {
      console.warn("Python backend is not available, using local mock fallback", backendError);
    }

    const draft = createMockDraft(idea);
    return NextResponse.json(draft);
  } catch (error) {
    console.error("Draft generation failed", error);
    return NextResponse.json({ error: "Failed to generate draft" }, { status: 500 });
  }
}
