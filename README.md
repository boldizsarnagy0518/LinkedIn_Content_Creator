# LinkedIn Content Creator

AI-powered LinkedIn content workflow app for turning rough ideas into polished, authentic LinkedIn posts.

The goal is not to build a simple AI post generator, but a small product-like workflow system:

```text
Idea capture → AI draft → critique/revision → approval → save/schedule → content memory
```

## Why this project exists

I wanted a more consistent way to publish weekly LinkedIn posts while building a personal brand around Data Engineering, AI workflows, university learnings, and career growth.

This app is designed to:

- capture rough thoughts anytime,
- remind me when I have not prepared content for the week,
- generate LinkedIn-style English drafts from Hungarian or English notes,
- support revision loops with human feedback,
- save approved posts,
- later use previous posts as personal brand memory.

## Current MVP

This initial version includes:

- Next.js App Router setup
- TypeScript
- Tailwind CSS
- clean dashboard UI
- idea input flow
- server-side draft generation endpoint
- Gemini API integration
- safe mock fallback when no API key is configured
- local browser history for saved drafts
- `.env.example`
- implementation roadmap

## Planned production architecture

```text
Frontend:        Next.js + TypeScript
UI:              Tailwind CSS
Backend:         Next.js API routes / Server Actions
Auth:            Supabase Auth
Database:        Supabase Postgres
Vector memory:   Supabase pgvector
LLM:             Gemini API
Workflow:        LangGraph.js
Scheduler:       Vercel Cron
Email:           Resend
Hosting:         Vercel
```

## Core workflow

```text
1. User adds a rough idea
2. App generates 3 hook options + final LinkedIn post
3. User can revise, approve, save, or copy the post
4. Approved posts are stored in content history
5. Weekly reminder checks whether this week already has an idea/draft
6. Later: previous posts are embedded and reused as personal brand memory
```

## Getting started

Clone the repository:

```bash
git clone https://github.com/boldizsarnagy0518/LinkedIn_Content_Creator.git
cd LinkedIn_Content_Creator
```

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env.local
```

Add your Gemini API key:

```bash
GEMINI_API_KEY=your_google_ai_studio_key
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment variables

```bash
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

If `GEMINI_API_KEY` is missing, the app returns a mock AI response so the UI remains testable.

## MVP user stories

- As a user, I can write a rough content idea in Hungarian or English.
- As a user, I can generate an English LinkedIn draft.
- As a user, I can get multiple hook options.
- As a user, I can save generated posts locally.
- As a user, I can copy the final post to LinkedIn manually.

## Roadmap

### Phase 1 — Local MVP

- [x] Project setup
- [x] Landing/dashboard UI
- [x] Idea input
- [x] Gemini generation endpoint
- [x] Mock fallback
- [x] Local saved drafts

### Phase 2 — Persistent data

- [ ] Supabase project setup
- [ ] Supabase Auth
- [ ] Postgres schema
- [ ] Row Level Security policies
- [ ] Save posts to database
- [ ] Save post versions

### Phase 3 — Weekly automation

- [ ] Posting preferences
- [ ] Vercel Cron endpoint
- [ ] Weekly reminder logic
- [ ] Resend email integration
- [ ] Notification logs

### Phase 4 — AI workflow quality

- [ ] Critic node
- [ ] Revision endpoint
- [ ] LangGraph.js workflow
- [ ] Human-in-the-loop state handling
- [ ] AI-sounding risk scoring

### Phase 5 — Personal brand memory

- [ ] Supabase pgvector
- [ ] Embeddings for approved posts
- [ ] Similar previous post retrieval
- [ ] Anti-repetition logic
- [ ] Topic balance insights

### Phase 6 — Optional LinkedIn integration

- [ ] LinkedIn OAuth research
- [ ] Manual publishing fallback
- [ ] API publishing experiment
- [ ] Scheduled publishing via app-side cron

## Product principle

> Build a personal content workflow system, not just a LinkedIn post generator.

## Portfolio value

This project demonstrates:

- full-stack app development,
- AI workflow design,
- LLM API integration,
- human-in-the-loop product thinking,
- data model planning,
- future vector memory architecture,
- automation with scheduled jobs,
- practical personal branding use case.
