# Architecture Decision Records

This file documents the main architecture and product decisions for the LinkedIn Content Creator project.

The goal of this document is to explain not only what decisions were made, but also why they were made and which alternatives were considered.

## ADR 001 — Build a workflow app, not just an AI post generator

### Status

Accepted

### Context

The original idea could have been implemented as a very simple app:

```text
input idea -> call LLM -> return LinkedIn post
```

However, this would be too small and too generic for the project goals.

The real problem is not just generating text. The problem is building a repeatable content creation workflow that helps the user post consistently on LinkedIn.

### Decision

The project will be designed as a personal content workflow system.

Core workflow:

```text
idea capture -> draft generation -> user review -> revision -> approval -> save/schedule -> future memory
```

### Alternatives considered

#### Simple AI post generator

Pros:

- easier to build
- faster MVP
- fewer moving parts

Cons:

- weaker portfolio value
- less useful long term
- no real workflow
- no reminder logic
- no approval/version history

#### Full social media scheduler from day one

Pros:

- more complete product
- closer to existing SaaS tools

Cons:

- too large for MVP
- LinkedIn API complexity
- too much scope before validating the core workflow

### Consequences

The project has more moving parts, but it becomes much stronger as a portfolio project.

It demonstrates product thinking, workflow design, backend architecture, scheduled automation, and future AI memory.

---

## ADR 002 — Use Next.js for the frontend

### Status

Accepted

### Context

The application needs a clean, interactive web interface where the user can:

- enter rough ideas
- view generated drafts
- copy posts
- save drafts
- approve posts
- later manage a content calendar

The project should be deployable easily and should look professional in a portfolio.

### Decision

Use **Next.js** with TypeScript for the frontend.

### Alternatives considered

#### Streamlit

Pros:

- very fast to build in Python
- comfortable for data/AI prototypes

Cons:

- less polished for a production-like web app
- less suitable for a modern SaaS-style UI
- weaker frontend portfolio signal

#### Plain React + Vite

Pros:

- lightweight
- simple frontend setup

Cons:

- less integrated routing/backend story than Next.js
- deployment and API proxy patterns require more manual decisions

#### Django templates

Pros:

- Python-first
- backend and frontend in one framework

Cons:

- less modern UX by default
- frontend would be less portfolio-friendly for modern web app expectations

### Consequences

The owner will need to learn some JavaScript/TypeScript, but this is acceptable and valuable.

Next.js provides a strong UI and deployment foundation while Python can still own the AI/backend logic.

---

## ADR 003 — Use Python FastAPI for AI/backend workflow logic

### Status

Accepted

### Context

The initial frontend is written in Next.js/TypeScript, but the project owner is stronger in Python.

The future backend will likely include:

- LLM integration
- prompt orchestration
- revision workflows
- LangGraph
- embeddings
- database operations
- scheduled checks
- analytics-like logic

These are all natural fits for Python.

### Decision

Use **Python FastAPI** as the backend service for AI and workflow logic.

The Next.js app calls the Python backend through an API route proxy.

Architecture:

```text
Next.js frontend -> Next.js API proxy -> FastAPI backend -> LLM/database/services
```

### Alternatives considered

#### All backend logic in Next.js / TypeScript

Pros:

- fewer services
- simpler deployment to Vercel
- one language for frontend and backend

Cons:

- less aligned with the owner's Python strength
- future LangGraph/Python AI workflow would be harder
- weaker Data Engineering / AI portfolio alignment

#### Pure Python full-stack app

Pros:

- one language
- easier for the owner initially

Cons:

- weaker frontend experience
- less modern product UI
- harder to create a polished SaaS-like app

### Consequences

The architecture has two runtimes: Node/Next.js and Python/FastAPI.

This adds some complexity, but it is a good tradeoff because it mirrors realistic production architectures and fits the project owner's learning goals.

---

## ADR 004 — Use Gemini first for LLM generation

### Status

Accepted

### Context

The project should be as close to 0 cost as possible during development.

The owner has access to Google AI Studio / Gemini and wants to avoid unnecessary API spending.

### Decision

Use **Gemini** as the first LLM provider.

The backend should be designed so the model provider can be replaced later if needed.

### Alternatives considered

#### OpenAI API

Pros:

- strong model quality
- excellent structured output capabilities
- common developer ecosystem

Cons:

- ChatGPT Plus does not include API usage
- separate billing would be needed
- not ideal for a 0-cost MVP goal

#### Anthropic Claude API

Pros:

- strong writing quality
- good for long-form text

Cons:

- likely paid API usage
- less aligned with current free tooling available to the owner

#### Local open-source model

Pros:

- no API cost
- privacy-friendly

Cons:

- more setup complexity
- weaker quality for writing unless using stronger local models
- hardware limitations

### Consequences

The project can move forward with low cost.

The backend should keep model access behind a service layer so switching providers later is easy.

---

## ADR 005 — Keep mock fallback during development

### Status

Accepted

### Context

The app should remain testable even when:

- no LLM key is configured
- Gemini fails
- the Python backend is not running
- network or provider errors happen

### Decision

Keep mock fallbacks at two levels:

1. Python backend mock fallback if no LLM key is available
2. Next.js mock fallback if the Python backend is unavailable

### Alternatives considered

#### Fail immediately if Gemini is unavailable

Pros:

- simpler code
- clearer failure behavior

Cons:

- worse developer experience
- frontend becomes harder to test
- development blocked by external services

### Consequences

The app is more resilient during development.

The UI can be tested independently from the LLM provider.

In production, fallback behavior can be made stricter if needed.

---

## ADR 006 — Use Supabase Postgres as the primary database

### Status

Accepted

### Context

The app needs to store structured workflow data:

- users/profiles
- ideas
- posts
- post versions
- statuses
- scheduled reminders
- notification logs
- LLM run logs

This is relational application data.

### Decision

Use **Supabase Postgres** as the primary database.

### Alternatives considered

#### ChromaDB

Pros:

- good for vector storage and semantic search
- useful for RAG prototypes

Cons:

- not a good primary relational database
- does not naturally model users, statuses, reminders, and version history
- would require another database anyway

#### DuckDB

Pros:

- excellent for local analytics
- great for CSV/Parquet analysis
- useful for data engineering experiments

Cons:

- not ideal as the primary database for a deployed web app
- not designed for user-facing transactional workflows
- no built-in auth/API platform like Supabase

#### SQLite

Pros:

- simple
- local development friendly

Cons:

- less suitable for hosted multi-user app
- would require additional hosting and API decisions

### Consequences

Supabase gives the project a production-like foundation:

- hosted Postgres
- auth support
- API support
- row-level security
- future pgvector support

It also aligns with the low-cost/free MVP goal.

---

## ADR 007 — Use Supabase pgvector for future personal brand memory

### Status

Accepted

### Context

A future feature should allow the app to reuse previous approved or posted content as personal brand memory.

Use cases:

- retrieve similar past posts
- avoid repeating the same idea too often
- maintain consistent style
- suggest underused topics

This requires vector embeddings and similarity search.

### Decision

Use **pgvector inside Supabase Postgres** instead of a separate vector database.

### Alternatives considered

#### ChromaDB

Pros:

- easy local vector store
- good for RAG experimentation

Cons:

- extra service to run
- extra deployment complexity
- separate persistence layer from the main app database
- unnecessary for the expected small data volume

#### Pinecone / managed vector DB

Pros:

- scalable vector search
- production-ready vector infrastructure

Cons:

- unnecessary for a small personal content app
- may introduce cost
- another external dependency

### Consequences

The project stays simpler.

Normal relational data and vector memory can live in the same Supabase project.

If the app grows much larger later, a dedicated vector database can still be introduced.

---

## ADR 008 — Defer LinkedIn auto-publishing

### Status

Accepted

### Context

One possible feature is automatic LinkedIn publishing or scheduled posting.

However, LinkedIn API publishing introduces complexity:

- OAuth setup
- permission scopes
- platform access limitations
- token management
- possible review/approval requirements
- risk of broken flows

### Decision

Do not implement LinkedIn auto-publishing in the MVP.

Initial publishing flow:

```text
Approved post -> Copy -> User manually posts on LinkedIn -> Mark as posted
```

### Alternatives considered

#### Add LinkedIn publishing immediately

Pros:

- more automated
- more complete product experience

Cons:

- significantly more complex
- API access may be blocked or limited
- distracts from the core content workflow

#### Use a third-party scheduler API

Pros:

- may simplify posting

Cons:

- likely paid
- another dependency
- less educational than building the core workflow first

### Consequences

The MVP is more reliable and easier to complete.

The project focuses on the highest-value workflow first: idea capture, generation, revision, approval, and content history.

---

## ADR 009 — Use localStorage only for the first frontend MVP

### Status

Accepted

### Context

The first UI needed a quick way to save generated drafts before the real database layer existed.

### Decision

Use browser localStorage only for early MVP testing.

### Alternatives considered

#### Add Supabase immediately

Pros:

- real persistence from the start
- closer to production

Cons:

- slower first iteration
- more setup before validating the UI workflow

### Consequences

The frontend MVP could be built and tested quickly.

This is temporary and should be replaced with Supabase persistence in Phase 3.

---

## ADR 010 — Use Markdown documentation as a first-class project artifact

### Status

Accepted

### Context

This project is intended to be portfolio-worthy and maintainable.

A future developer or AI agent should be able to understand the goal, context, architecture, and decisions quickly.

### Decision

Create a `documentations` folder containing:

- `context.md` — full project context and product/technical overview
- `ADR.md` — architecture decision records and rationale

### Alternatives considered

#### Keep context only in chat history

Pros:

- no extra work initially

Cons:

- hard for new developers/agents to recover context
- not portfolio-friendly
- decisions get lost over time

#### Keep only README documentation

Pros:

- simpler repository

Cons:

- README can become too long
- ADRs deserve a dedicated place
- implementation details and decision rationale should be separated

### Consequences

The project becomes easier to maintain, resume, and present.

This also improves AI-agent collaboration because future agents can read the project context directly from the repository.

---

## ADR 011 — Keep the system low-cost during MVP

### Status

Accepted

### Context

The project owner wants to avoid spending money during the early development phase.

### Decision

Prefer free-tier tools during MVP:

- GitHub for source control
- Vercel for frontend hosting
- Supabase free tier for database/auth
- Gemini free tier for LLM experimentation
- Resend free tier or similar for reminders

### Alternatives considered

#### Use paid managed services immediately

Pros:

- fewer limits
- potentially more reliable

Cons:

- unnecessary for a personal MVP
- conflicts with the 0-cost goal

### Consequences

The project may need some rate-limit awareness, but the expected usage is very small.

For personal usage and portfolio demo purposes, free tiers should be enough.

---

## ADR 012 — Defer LangGraph until the workflow complexity justifies it

### Status

Accepted

### Context

LangGraph is a strong fit for long-running, stateful, human-in-the-loop AI workflows.

The planned final app may include:

- draft generation
- critic review
- revision loop
- approval
- memory update
- scheduled reminders

However, using LangGraph too early could add unnecessary complexity before the core generation and revision endpoints are stable.

### Decision

Do not force LangGraph into the very first MVP.

Add LangGraph once the workflow contains enough meaningful states:

```text
generate -> critique -> revise -> approve -> embed -> notify
```

### Alternatives considered

#### Use LangGraph immediately

Pros:

- strong AI workflow portfolio signal
- future architecture visible early

Cons:

- may slow down early development
- could over-engineer a not-yet-validated workflow

### Consequences

The early app stays simpler.

LangGraph remains part of the roadmap and can be introduced once revision, approval, and memory flows exist.
