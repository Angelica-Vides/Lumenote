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
│  │ Login    │  │ NoteForm │  │  notes.js            │  │
│  │ Register │  │ NoteList │  │  validation.js       │  │
│  │ Dashboard│  │ NoteCard │  └──────────┬───────────┘  │
│  └──────────┘  └──────────┘             │              │
└─────────────────────────────────────────┼──────────────┘
                                            │ HTTPS + JWT
                                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Supabase (BaaS)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Auth        │  │ PostgREST    │  │ PostgreSQL    │  │
│  │ email/pwd   │  │ REST API     │  │ notes table   │  │
│  │ bcrypt hash │  │ auto from    │  │ RLS policies  │  │
│  │ JWT sessions│  │ schema       │  │ triggers      │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Layer Responsibilities

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Presentation** | `src/pages/`, `src/components/` | UI, forms, routing, user feedback |
| **State** | `src/context/AuthContext.jsx` | Auth session, sign up/in/out |
| **Data access** | `src/lib/notes.js` | CRUD calls, error mapping |
| **AI access** | `src/lib/ai.js`, `supabase/functions/ai-notes` | Authenticated AI summaries and suggestions |
| **Validation** | `src/lib/validation.js` | Client-side input checks before API |
| **Client config** | `src/lib/supabase.js` | Supabase client singleton |
| **Database** | `supabase/schema.sql` | Schema, indexes, RLS, triggers |
| **CI/CD** | `.github/workflows/deploy.yml` | Build + deploy on push to `main` |

---

## Request Flow (Example: Create Note)

1. User submits `NoteForm` on Dashboard.
2. `validation.js` checks title length, body length, color enum.
3. `notes.js` calls `supabase.from('notes').insert({...})`.
4. Supabase client attaches JWT from auth session.
5. PostgREST runs INSERT; PostgreSQL RLS verifies `auth.uid() = user_id`.
6. New row returned to client; Dashboard updates local state.

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
| Production | GitHub Pages | Push to `main` via GitHub Actions |

Build injects `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_BASE_PATH` from GitHub Secrets / workflow env. Supabase stores `OPENAI_API_KEY` and optional `OPENAI_MODEL` as Edge Function secrets.

---

## Related Docs

- [PLAN.md](../PLAN.md) — concept and scope
- [BUILD_STEPS.md](../BUILD_STEPS.md) — incremental build order
- [DIAGRAMS.md](../DIAGRAMS.md) — Mermaid diagrams
- [DATABASE.md](./DATABASE.md) — schema and ERD details
