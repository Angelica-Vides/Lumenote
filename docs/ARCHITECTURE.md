# Lumenote — Architecture Overview

How the frontend, backend (BaaS), and database fit together.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (SPA)                        │
│  React + Vite + React Router + AuthContext              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Pages   │  │Components│  │  lib/ (data access)  │  │
│  │ Home     │  │ Layout   │  │  supabase.js         │  │
│  │ Login    │  │ NotesTabs│  │  notes.js            │  │
│  │ Register │  │ NoteForm │  │  noteBody.js         │  │
│  │ Dashboard│  │ RichText │  │  noteImages.js       │  │
│  │ NoteEdit │  │ NoteList │  │  ai.js               │  │
│  └──────────┘  │ NoteCard │  │  validation.js       │  │
│                │ AiAssist │  └──────────┬───────────┘  │
│                └──────────┘             │              │
└─────────────────────────────────────────┼──────────────┘
                                            │ HTTPS + JWT
                                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Supabase (BaaS)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Auth        │  │ PostgREST    │  │ PostgreSQL    │  │
│  │ email/pwd   │  │ REST API     │  │ notes table   │  │
│  │ bcrypt hash │  │ auto from    │  │ ai_requests   │  │
│  │ JWT sessions│  │ schema       │  │ Storage bucket│  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Edge Function: ai-notes (OpenAI, rate limits)     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Layer Responsibilities

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Presentation** | `src/pages/`, `src/components/` | UI, forms, routing, user feedback |
| **State** | `src/context/AuthContext.jsx` | Auth session, sign up/in/out |
| **Data access** | `src/lib/notes.js`, `src/lib/noteImages.js` | CRUD calls, image uploads, error mapping |
| **Rich text** | `src/components/RichTextEditor.jsx`, `src/lib/noteBody.js` | TipTap editor, HTML sanitize/strip |
| **AI access** | `src/lib/ai.js`, `supabase/functions/ai-notes` | Authenticated AI summaries and suggestions |
| **Validation** | `src/lib/validation.js` | Client-side input checks before API |
| **Client config** | `src/lib/supabase.js` | Supabase client singleton |
| **Database** | `supabase/schema.sql` | Schema, indexes, RLS, triggers |
| **CI/CD** | `.github/workflows/deploy.yml` | Build + deploy on push to `main` |

---

## Request Flow (Example: Create Note)

1. User submits `NoteForm` on the **New Note** or **Edit Note** page.
2. `RichTextEditor` produces HTML; `validation.js` checks title length, plain-text body (≤ 20,000 chars), and color.
3. `notes.js` calls `supabase.from('notes').insert({...})` or `.update(...)`.
4. Supabase client attaches JWT from auth session.
5. PostgREST runs INSERT/UPDATE; PostgreSQL RLS verifies `auth.uid() = user_id`.
6. User is redirected to **My Notes**; dashboard updates the sticky-note grid.

## Request Flow (Example: AI Summary)

1. User clicks **Summarize notes** in the protected Dashboard.
2. `ai.js` invokes the `ai-notes` Supabase Edge Function with the active session.
3. The function verifies the JWT and checks `ai_requests` for the hourly limit.
4. The function reads the user’s own notes through RLS.
5. The function calls OpenAI with server-side `OPENAI_API_KEY`.
6. Structured JSON is returned to React and rendered in the AI assistant card.

---

## Security Model

| Concern | Approach |
|---------|----------|
| Password storage | Supabase Auth (bcrypt); never in client or `notes` table |
| API keys | Anon key in `.env`; safe for client with RLS enabled |
| Data isolation | RLS on `notes` — users only access own rows |
| Route protection | `ProtectedRoute` redirects unauthenticated users |
| Secrets in git | `.env` gitignored; `.env.example` committed without real values |
| AI API key | Stored only as a Supabase Edge Function secret |
| AI rate limits | `ai_requests` tracks per-user hourly usage |

---

## Deployment Architecture

| Environment | Host | Trigger |
|-------------|------|---------|
| Local dev | `npm run dev` (localhost:5173) | Manual |
| Production | Netlify (`lumenote-angelica-vides.netlify.app`) | Manual CLI deploy of `dist` |

Build uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env`. Supabase stores `OPENAI_API_KEY` and optional `OPENAI_MODEL` as Edge Function secrets. Image uploads use the `note-images` Storage bucket (see migration `002_note_images_storage.sql`).

---

## Related Docs

- [PLAN.md](../PLAN.md) — concept and scope
- [BUILD_STEPS.md](../BUILD_STEPS.md) — incremental build order
- [DIAGRAMS.md](../DIAGRAMS.md) — Mermaid diagrams
- [DATABASE.md](./DATABASE.md) — schema and ERD details
