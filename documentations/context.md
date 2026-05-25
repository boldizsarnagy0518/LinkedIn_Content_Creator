# Project Context — LinkedIn Content Creator

## 1. Project overview

**LinkedIn Content Creator** is an AI-powered personal branding workflow application.

The product helps the user capture rough content ideas, transform them into polished but authentic LinkedIn posts, review and revise them through a human-in-the-loop process, approve final versions, and eventually manage a weekly content workflow with reminders and content memory.

The core idea is not to build a simple AI text generator. The project should become a small but production-inspired workflow system for personal content creation.

Core product principle:

> Build a personal content workflow system, not just a LinkedIn post generator.

## 2. Main user problem

The user wants to post consistently on LinkedIn, ideally once per week, but often forgets or does not have a structured process for turning raw thoughts into publishable posts.

The user frequently has ideas, reflections, or rough notes, but these ideas are often not immediately ready for LinkedIn. They may be written in Hungarian, informal English, bullet points, or messy draft form.

The app should reduce friction in the following workflow:

```text
Rough idea -> LinkedIn-ready draft -> user review -> revision -> approval -> saved/scheduled/post-ready content
```

The system should also support the habit-building side of content creation by sending weekly reminders only when the user has not already prepared an idea or draft for that week.

## 3. Primary user

The initial primary user is the project owner.

Profile context:

- Data Engineer at Bosch
- Business Informatics student
- Interested in Data Engineering, AI workflows, analytics, personal branding, and practical software projects
- Stronger in Python than JavaScript/TypeScript, but open to learning JS/TS
- Wants this project to be both personally useful and portfolio-worthy

The app is built as a personal workflow tool first, but the architecture should be clean enough to later support multiple users.

## 4. Portfolio goal

The project should demonstrate more than UI building or prompt writing.

It should show:

- full-stack application development
- Python backend design
- AI/LLM integration
- human-in-the-loop workflow design
- structured data modeling
- scheduled automation
- future vector memory / retrieval architecture
- practical product thinking
- clean documentation and architectural decisions

The project should be presentable on GitHub, LinkedIn, and in a CV/portfolio.

A good portfolio summary would be:

> I built an AI-powered LinkedIn content workflow app that turns rough ideas into reviewed, approved, and reusable LinkedIn posts. The system combines a Next.js frontend, Python FastAPI backend, LLM-based generation, planned Supabase persistence, weekly reminders, and future vector memory for personal brand consistency.

## 5. Current high-level architecture

Current architecture:

```text
Next.js frontend
  -> Next.js API proxy route
  -> Python FastAPI backend
  -> Gemini service or mock fallback
```

The frontend remains in Next.js because it is a strong choice for modern web UI, deployment on Vercel, and future user-facing dashboard work.

The AI/backend logic is moving toward Python because the project owner is more experienced in Python, and Python is a better fit for future LangGraph, data processing, embeddings, and AI workflow logic.

## 6. Current repository structure

Expected current structure:

```text
app/
  api/
    generate/
      route.ts
  globals.css
  layout.tsx
  page.tsx

backend/
  app/
    __init__.py
    config.py
    main.py
    models.py
    prompts.py
    services.py
  requirements.txt
  README.md

components/              # future UI components
lib/
  mock-draft.ts

types/
  content.ts

docs/
  IMPLEMENTATION_PLAN.md
  PHASE_2_BACKEND_INTEGRATION.md

documentations/
  context.md
  ADR.md
```

The `docs` folder contains implementation-stage documentation.

The `documentations` folder contains long-lived project context and architecture decision records intended for developers, reviewers, and AI agents.

## 7. Current implemented features

The current MVP scaffold includes:

- Next.js App Router
- TypeScript
- Tailwind CSS
- dashboard-style UI
- idea input field
- starter idea suggestions
- draft generation button
- mock draft generation
- generated hook options
- generated LinkedIn post preview
- hashtags display
- copy-to-clipboard action
- save draft action
- approve action
- localStorage-based saved content history
- Python FastAPI backend scaffold
- Python `/health` endpoint
- Python `/generate` endpoint
- backend mock fallback
- Gemini-ready backend service structure
- Next.js route proxying to the Python backend when available

## 8. Development status

The project is currently between Phase 1 and Phase 2.

Phase 1 created the frontend MVP scaffold and mock generation.

Phase 2 introduced the Python backend and prepared the codebase for real LLM integration.

The next practical step is local validation:

1. run the frontend locally
2. run the Python backend locally
3. confirm the frontend can call the backend
4. configure Gemini locally
5. test real LLM generation
6. add revision support

## 9. Local development flow

### Frontend

From the repository root:

```bash
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

### Backend

From the repository root:

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend health check:

```text
http://localhost:8000/health
```

Backend API docs:

```text
http://localhost:8000/docs
```

## 10. Main product workflow

The intended full workflow is:

```text
1. User captures a rough idea
2. System stores the idea
3. LLM generates multiple hook options and a full LinkedIn post
4. User reviews the generated draft
5. User either approves or requests a revision
6. Each revision is saved as a new version
7. Approved version is saved as final
8. User copies the post or schedules a reminder to post manually
9. Later, approved/posted content is reused as memory
```

## 11. MVP workflow

The current simplified MVP workflow is:

```text
User idea
  -> Generate draft
  -> View mock/generated post
  -> Copy
  -> Save draft
  -> Approve
  -> View saved local history
```

This MVP intentionally avoids LinkedIn auto-publishing and persistent database complexity until the core content workflow works well.

## 12. Planned phases

### Phase 1 — Local MVP

Goal:

- working UI
- rough idea input
- mock generation
- copy/save/approve actions
- local content history

Status: mostly implemented.

### Phase 2 — Python backend and Gemini integration

Goal:

- Python FastAPI backend
- structured prompt generation
- Gemini integration
- fallback mock generation
- JSON output validation

Status: started.

Next work:

- test locally
- configure Gemini locally
- improve parsing and error handling
- add revision endpoint

### Phase 3 — Supabase persistence

Goal:

Move from localStorage to real database-backed persistence.

Initial tables:

- profiles
- content_ideas
- posts
- post_versions
- notifications
- llm_runs

This enables:

- real saved history
- version tracking
- status tracking
- future reminders
- future analytics

### Phase 4 — Weekly reminders

Goal:

Send weekly reminders only if the user has not already submitted an idea or created a draft for the current week.

Planned tools:

- Vercel Cron or backend scheduler
- Resend or similar email provider
- notification logs in Supabase

Reminder logic:

```text
Daily/weekly scheduled check
  -> identify current week
  -> check if an idea/draft/approved post exists
  -> if yes: skip reminder
  -> if no: send reminder
```

### Phase 5 — Revision and approval workflow

Goal:

Add proper human-in-the-loop control.

User should be able to say:

- make it shorter
- make it less AI-sounding
- make it more personal
- add a stronger hook
- remove corporate language
- keep the tone more natural

The system should generate a new version and keep the previous versions.

### Phase 6 — LangGraph workflow

Goal:

Represent the AI process as a stateful workflow.

Possible graph:

```text
LoadUserProfile
  -> LoadBrandMemory
  -> ClassifyInput
  -> GenerateDraft
  -> CritiqueDraft
  -> ImproveDraft
  -> SaveDraftVersion
  -> WaitForUserReview
```

This is not needed for the first working MVP, but it is useful once the generation, revision, approval, and memory steps become more complex.

### Phase 7 — Personal brand memory

Goal:

Use previous approved/posted content as long-term memory.

Planned behavior:

- embed approved posts
- retrieve similar past posts
- avoid repeating the same topic/angle too often
- maintain a consistent but not repetitive style
- suggest underused themes

Preferred implementation:

- Supabase Postgres for normal data
- Supabase pgvector for embeddings and similarity search

### Phase 8 — Content calendar

Goal:

Make the content workflow visible.

Possible views:

- current week status
- draft list
- approved posts
- posted posts
- monthly calendar
- topic distribution
- streak / consistency indicator

### Phase 9 — Optional LinkedIn integration

Goal:

Potentially publish through LinkedIn API later.

This should not be part of the MVP.

Reason:

- LinkedIn API publishing requires OAuth and correct platform permissions
- API access can be more complex than expected
- manual copy/publish is reliable and enough for the early product

Preferred initial publishing flow:

```text
Approved post -> Copy -> Open LinkedIn manually -> Mark as posted
```

## 13. Key entities

### Content idea

A raw thought or note from the user.

Can be:

- Hungarian
- English
- bullet points
- rough paragraph
- a topic only
- a nearly finished draft

### Post

The main content item created from an idea.

A post has a status:

```text
idea -> draft -> revision_requested -> approved -> scheduled -> posted -> archived
```

### Post version

Every generated or revised version of a post.

Important for:

- human-in-the-loop history
- comparing revisions
- tracking feedback
- portfolio-quality workflow design

### Notification

A reminder event.

Used for weekly posting consistency.

### LLM run

A log of an AI operation.

Useful for:

- debugging
- observability
- future cost tracking
- portfolio-quality engineering design

### Brand memory

Future memory object extracted from approved/posted content.

Used to maintain consistent style and avoid repetition.

## 14. Suggested database model

Initial Supabase tables:

```text
profiles
content_ideas
posts
post_versions
notifications
llm_runs
brand_memory
```

The relational data belongs in Postgres.

The future vector memory belongs in pgvector inside the same Supabase project.

This avoids unnecessary complexity from running a separate vector database during the early phases.

## 15. Why the app should avoid auto-publishing first

LinkedIn auto-publishing is intentionally not part of the early MVP.

Reasons:

- more complex OAuth flow
- possible permission and product access limitations
- higher risk of broken flows
- not necessary for proving the product value
- manual publishing is good enough for personal use

The product should first solve the content workflow:

```text
idea -> draft -> revise -> approve -> copy/post manually
```

Only after this works well should LinkedIn API publishing be explored.

## 16. AI writing style requirements

The generated LinkedIn posts should:

- be written in English
- sound natural and human
- avoid generic motivational writing
- avoid excessive corporate tone
- avoid fake achievements
- avoid confidential workplace details
- be useful to people interested in data, AI, analytics, or early career growth
- reflect the user's real experience and perspective
- stay concise and readable

The assistant should not invent specific details about Bosch, internal projects, or confidential work.

## 17. Core prompt direction

The AI should behave like a LinkedIn writing assistant for a young Data Engineer and Business Informatics student.

It should turn rough Hungarian or English thoughts into professional but authentic LinkedIn posts.

The writing style should be:

```text
simple
personal
professional
not too polished
not corporate
not AI-sounding
```

## 18. Important engineering constraints

The project should remain low-cost or free during the MVP stage.

Preferred free/low-cost tools:

- GitHub for source control
- Vercel for frontend deployment
- Supabase for database and future auth
- Gemini free tier for generation experiments
- Resend free tier or similar for reminders

The architecture should avoid unnecessary moving parts until the core workflow is stable.

## 19. What a new developer or AI agent should understand

If a developer or AI agent joins this project, they should understand the following:

1. The goal is a workflow app, not a simple chatbot.
2. The first user is the project owner, but the design should not block future multi-user support.
3. Python should own AI/backend workflow logic.
4. Next.js should own the UI and user-facing app experience.
5. Supabase should become the primary persistent database.
6. pgvector should be used later for memory.
7. ChromaDB and DuckDB are not needed for the core app at this stage.
8. LinkedIn auto-publishing is intentionally deferred.
9. Manual publishing is the preferred MVP behavior.
10. Documentation and architecture clarity are part of the portfolio value.

## 20. Immediate next steps

Recommended next steps:

1. Test the current frontend locally.
2. Test the current Python backend locally.
3. Confirm frontend-to-backend generation works.
4. Configure Gemini locally.
5. Improve response parsing and validation.
6. Add a `/revise` endpoint to the Python backend.
7. Add revision UI to the frontend.
8. Add Supabase schema migrations.
9. Replace localStorage with Supabase persistence.
10. Add weekly reminder logic.
