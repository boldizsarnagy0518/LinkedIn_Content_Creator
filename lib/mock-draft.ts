import type { DraftResponse } from "@/types/content";

export function createMockDraft(idea: string): DraftResponse {
  return {
    hooks: [
      "The hardest part of building data systems is not choosing the tool.",
      "Consistency in data engineering usually comes from boring decisions.",
      "A small workflow improvement can be more valuable than a new framework."
    ],
    post: `One thing I keep noticing in data engineering: the tool is rarely the whole story.\n\nA good pipeline is not only about using the newest technology. It is about making data reliable, understandable, and easy to use for the people who depend on it.\n\nThat often means simple things:\n- clear ownership\n- predictable transformations\n- good naming\n- useful logs\n- checks that fail early\n\nMy rough idea for this post was:\n\n"${idea}"\n\nThe more I work with data workflows, the more I appreciate systems that are boring in the best possible way: stable, transparent, and easy to debug.`,
    hashtags: ["DataEngineering", "Analytics", "AIWorkflows"],
    firstComment: "Curious how others think about this: what makes a data workflow feel reliable to you?",
    model: "mock-local-fallback",
    usedMock: true
  };
}
