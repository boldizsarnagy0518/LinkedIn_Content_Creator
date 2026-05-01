"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clipboard, Loader2, PenLine, Sparkles } from "lucide-react";
import type { DraftResponse, SavedDraft } from "@/types/content";

const starterIdeas = [
  "A small data pipeline improvement that made work easier",
  "What business school taught me about data engineering",
  "Why reliable workflows matter more than fancy tools",
  "How AI assistants are changing the way I learn and build",
  "A powerlifting lesson that also applies to engineering"
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [idea, setIdea] = useState("");
  const [draft, setDraft] = useState<DraftResponse | null>(null);
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("linkedin-content-drafts");
    if (saved) {
      setSavedDrafts(JSON.parse(saved) as SavedDraft[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("linkedin-content-drafts", JSON.stringify(savedDrafts));
  }, [savedDrafts]);

  const weeklyStatus = useMemo(() => {
    if (savedDrafts.some((item) => item.status === "approved")) return "Approved draft ready";
    if (savedDrafts.length > 0) return "Draft in progress";
    return "No idea captured yet";
  }, [savedDrafts]);

  async function handleGenerate() {
    if (!idea.trim()) return;

    setIsGenerating(true);
    setError(null);
    setCopied(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea })
      });

      if (!response.ok) {
        throw new Error("Failed to generate draft");
      }

      const data = (await response.json()) as DraftResponse;
      setDraft(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }

  function saveDraft(status: SavedDraft["status"] = "draft") {
    if (!draft) return;

    const saved: SavedDraft = {
      ...draft,
      id: crypto.randomUUID(),
      idea,
      createdAt: new Date().toISOString(),
      status
    };

    setSavedDrafts((current) => [saved, ...current]);
  }

  async function copyPost() {
    if (!draft) return;
    await navigator.clipboard.writeText(draft.post);
    setCopied(true);
  }

  return (
    <main className="min-h-screen px-6 py-8 text-slate-100 md:px-10">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-soft backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
              <Sparkles size={16} /> AI-powered personal branding workflow
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              LinkedIn Content Creator
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Capture rough thoughts, turn them into authentic English LinkedIn drafts, review them, and build a repeatable weekly content workflow.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:min-w-72">
            <p className="text-sm text-slate-400">This week</p>
            <p className="mt-2 flex items-center gap-2 text-lg font-medium">
              <CalendarDays className="text-sky-300" size={20} /> {weeklyStatus}
            </p>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-300">
                <PenLine size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Add a rough idea</h2>
                <p className="text-sm text-slate-400">Hungarian, English, bullet points, or a messy draft all work.</p>
              </div>
            </div>

            <textarea
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="Example: I want to write about how reliable data workflows matter more than using the newest tool..."
              className="mt-6 min-h-52 w-full resize-none rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-base leading-7 outline-none ring-sky-400/30 transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {starterIdeas.map((item) => (
                <button
                  key={item}
                  onClick={() => setIdea(item)}
                  className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-400 hover:text-sky-200"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !idea.trim()}
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                Generate LinkedIn draft
              </button>
            </div>

            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold">Generated draft</h2>
            <p className="mt-1 text-sm text-slate-400">MVP currently uses a mock fallback. Gemini integration is the next backend step.</p>

            {!draft ? (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
                Your generated post will appear here.
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-400">Hook options</p>
                  <div className="space-y-2">
                    {draft.hooks.map((hook) => (
                      <div key={hook} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-200">
                        {hook}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-400">Final post</p>
                  <article className="whitespace-pre-wrap rounded-3xl border border-slate-800 bg-slate-900/80 p-5 leading-7 text-slate-100">
                    {draft.post}
                  </article>
                </div>

                <div className="flex flex-wrap gap-2">
                  {draft.hashtags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 text-sm text-sky-200">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button onClick={copyPost} className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-4 py-3 font-medium text-slate-200 transition hover:border-sky-400">
                    <Clipboard size={18} /> {copied ? "Copied" : "Copy"}
                  </button>
                  <button onClick={() => saveDraft("draft")} className="rounded-2xl border border-slate-700 px-4 py-3 font-medium text-slate-200 transition hover:border-sky-400">
                    Save draft
                  </button>
                  <button onClick={() => saveDraft("approved")} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300">
                    <CheckCircle2 size={18} /> Approve
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-soft">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Saved content history</h2>
              <p className="text-sm text-slate-400">Local-only for now. Supabase persistence comes in the next phase.</p>
            </div>
            <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">
              {savedDrafts.length} saved
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedDrafts.length === 0 ? (
              <p className="text-slate-400">No saved drafts yet.</p>
            ) : (
              savedDrafts.map((item) => (
                <article key={item.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={classNames(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        item.status === "approved" ? "bg-emerald-400/15 text-emerald-200" : "bg-sky-400/15 text-sky-200"
                      )}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-4 line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-slate-300">{item.post}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
