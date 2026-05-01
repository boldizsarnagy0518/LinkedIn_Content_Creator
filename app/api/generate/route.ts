import { NextResponse } from "next/server";
import { createMockDraft } from "@/lib/mock-draft";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { idea?: string };
    const idea = body.idea?.trim();

    if (!idea) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
    }

    const draft = createMockDraft(idea);
    return NextResponse.json(draft);
  } catch (error) {
    console.error("Draft generation failed", error);
    return NextResponse.json({ error: "Failed to generate draft" }, { status: 500 });
  }
}
