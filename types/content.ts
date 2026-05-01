export type DraftResponse = {
  hooks: string[];
  post: string;
  hashtags: string[];
  firstComment?: string;
  model: string;
  usedMock: boolean;
};

export type SavedDraft = DraftResponse & {
  id: string;
  idea: string;
  createdAt: string;
  status: "draft" | "approved" | "posted";
};
