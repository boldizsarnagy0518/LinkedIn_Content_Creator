# Implementation Plan

This document describes the planned build path for the LinkedIn Content Creator project.

The project should evolve from a local MVP into a portfolio-ready AI workflow application.

## Product vision

LinkedIn Content Creator is an AI-powered personal branding workflow app.

It helps the user:

1. capture rough content ideas,
2. generate authentic LinkedIn-style English posts,
3. revise posts with human feedback,
4. approve and save final versions,
5. get weekly reminders when no post idea exists,
6. reuse previous posts as long-term personal brand memory.

The product principle:

> Build a personal content workflow system, not just a post generator.

## Phase 1 — Local MVP

Status: partially implemented.

### Goals

- Create a clean app shell.
- Allow the user to enter a rough content idea.
- Generate a LinkedIn post draft.
- Support copy, save, and approve actions.
- Keep the app testable without external services.

### Current implementation

- Next.js App Router
- TypeScript
- Tailwind CSS
- mock draft generation endpoint
- localStorage-based saved draft history
- dashboard-style UI

### Remaining work

- Replace mock generator with Gemini service.
- Add revision input.
- Add better status transitions.
- Add validation and loading states for all actions.

## Phase 2 — Gemini integration

### Goal

Use a real LLM to convert rough ideas into high-quality English LinkedIn posts.

### Planned flow

```text
User idea
  -> server route
  -> prompt template
  -> Gemini API
  -> parsed JSON response
  -> UI draft card
```

### Expected output shape

```json
{
  "hooks": ["hook 1", "hook 2", "hook 3"],
  "post": "final LinkedIn post",
  "hashtags": ["DataEngineering", "AI", "Career"],
  "firstComment": "optional first comment"
}
```

### Prompt principles

- Simple English.
- Personal but not oversharing.
- Professional but not corporate.
- No confidential workplace details.
- No generic LinkedIn clichés.
- No fake achievements.
- Useful for readers interested in data, AI, career, or business informatics.

## Phase 3 — Supabase persistence

### Goal

Move from localStorage to real persistent data.

### Tables

#### profiles

```sql
id uuid primary key
email text
full_name text
timezone text
posting_day text
posting_time time
preferred_language text
preferred_tone text
created_at timestamp
updated_at timestamp
```

#### content_ideas

```sql
id uuid primary key
user_id uuid references profiles(id)
raw_input text not null
input_language text
topic text
week_start date
source text
status text
created_at timestamp
```

#### posts

```sql
id uuid primary key
user_id uuid references profiles(id)
idea_id uuid references content_ideas(id)
title text
status text
current_version_id uuid
approved_version_id uuid
scheduled_at timestamp
posted_at timestamp
linkedin_url text
created_at timestamp
updated_at timestamp
```

#### post_versions

```sql
id uuid primary key
post_id uuid references posts(id)
version_number int
content text
hook_options jsonb
hashtags jsonb
first_comment text
feedback_prompt text
model_name text
critic_score jsonb
created_at timestamp
```

#### notifications

```sql
id uuid primary key
user_id uuid references profiles(id)
type text
status text
scheduled_for timestamp
sent_at timestamp
metadata jsonb
created_at timestamp
```

#### llm_runs

```sql
id uuid primary key
user_id uuid references profiles(id)
post_id uuid references posts(id)
run_type text
model_name text
input_tokens int
output_tokens int
status text
error_message text
created_at timestamp
```

## Phase 4 — Weekly reminder automation

### Goal

The app should help the user stay consistent.

### Logic

```text
Daily cron trigger
  -> get current week
  -> check if the user has idea/draft/approved post for this week
  -> if yes: skip reminder
  -> if no: send reminder email
  -> log notification result
```

### Tools

- Vercel Cron
- Resend
- protected cron endpoint

### Important implementation detail

The cron route should require a secret header so it cannot be triggered publicly by anyone.

## Phase 5 — Revision and approval workflow

### Goal

Add human-in-the-loop control.

### Flow

```text
Draft generated
  -> user reviews
  -> user approves OR asks for revision
  -> revision creates a new post version
  -> approval locks final version
```

### Revision examples

- Make it shorter.
- Make it less AI-sounding.
- Make it more personal.
- Keep it professional.
- Add a stronger opening hook.
- Remove corporate language.

## Phase 6 — LangGraph workflow

### Goal

Represent the AI process as a stateful workflow.

### Planned graph

```text
START
  -> LoadUserProfile
  -> LoadBrandMemory
  -> ClassifyInput
  -> GenerateDraft
  -> CritiqueDraft
  -> ImproveDraft
  -> SaveDraftVersion
  -> WaitForUserReview
```

### Revision graph

```text
UserFeedback
  -> LoadCurrentDraft
  -> LoadRevisionHistory
  -> ReviseDraft
  -> CritiqueRevision
  -> SaveNewVersion
  -> WaitForUserReview
```

### Approval graph

```text
ApproveDraft
  -> SaveApprovedVersion
  -> GenerateEmbedding
  -> UpdateBrandMemory
  -> SetPostStatusApproved
```

## Phase 7 — Personal brand memory

### Goal

Use previous approved posts as memory.

### Why

The app should not generate isolated posts. It should understand the user's recurring topics, tone, and writing patterns.

### Planned memory features

- Store embeddings for approved posts.
- Retrieve similar past posts during generation.
- Avoid repeating the same angle too often.
- Suggest underused topics.
- Maintain style rules.

### Vector database

Use Supabase pgvector instead of a separate vector database.

## Phase 8 — Content calendar

### Goal

Make the workflow visible and easy to manage.

### Views

- current week status
- monthly post calendar
- draft list
- approved list
- posted list
- topic distribution

### Example statuses

```text
idea -> draft -> revision_requested -> approved -> scheduled -> posted
```

## Phase 9 — Optional LinkedIn integration

### Recommendation

Do not make LinkedIn auto-publishing part of the MVP.

### Reason

LinkedIn API publishing requires OAuth, correct permissions, and platform access. Manual copy/publish is more reliable for the first version.

### Recommended approach

1. Manual publishing mode first.
2. Add LinkedIn OAuth later.
3. Keep manual fallback even after API integration.
4. Store scheduled posts in the app and publish through the API only if access is available.

## Engineering priorities

### Keep scope controlled

Avoid adding too much too early:

- no billing,
- no multi-platform posting,
- no image generation,
- no mobile app,
- no complex analytics before the core workflow works.

### Build in public quality

The project should be easy to explain in a LinkedIn post and a GitHub README.

Good technical highlights:

- human-in-the-loop AI workflow,
- stateful content pipeline,
- scheduled automation,
- vector memory,
- safe manual publishing fallback,
- clean product UX.

## Suggested next coding steps

1. Add real Gemini generation service.
2. Add revision route.
3. Add Supabase schema migration file.
4. Replace localStorage with Supabase tables.
5. Add weekly reminder cron route.
6. Add Resend email service.
7. Add LangGraph workflow.
8. Add pgvector memory.

## Success criteria for MVP

The MVP is successful when:

1. the user can enter a rough Hungarian or English idea,
2. the app generates a LinkedIn-ready English post,
3. the user can copy it,
4. the user can save it,
5. the user can approve it,
6. the user can see saved content history,
7. the project can be deployed to Vercel,
8. the README clearly explains the architecture and roadmap.
