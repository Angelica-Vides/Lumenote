# Lumenote — Incremental Build Steps

Each step is small and ends with a **Verify** checkpoint. Stack: React + Vite + Supabase.

> **Start here only after design sign-off.** Complete [DESIGN.md](./DESIGN.md) checklist and iterate on [mockup.html](./mockup.html) first.

Suggested order: **0 → 1 → 2 → … → 9**

---

## Step 0 — Plan & design (before code)

**Goal:** Locked scope, visual design, and open decisions resolved.

- Review [PLAN.md](./PLAN.md) MVP scope and open decisions (§9).
- Iterate on [mockup.html](./mockup.html) — colors, layout, screens.
- Update [DESIGN.md](./DESIGN.md) tokens and wireframes.
- Log changes in [DESIGN_LOG.md](./DESIGN_LOG.md).
- Mark design checklist complete in DESIGN.md §7.

**Verify:** Stakeholder (you) approves mockup; all PLAN.md §9 decisions marked ✅.

**Commit:** `docs: finalize Lumenote plan and design mockup`

---

## Step 1 — Scaffold the frontend

**Goal:** Running Vite + React app with Lumenote landing page and routing.

- Initialize project: React + Vite, React Router.
- Create `Layout`, `Home`, placeholder routes for `/login`, `/register`, `/dashboard`.
- Apply Lumenote dark theme (teal accent v0.2) in `index.css`.

**Verify:** `npm run dev` → landing page loads; nav links route correctly.

**Commit:** `feat: scaffold Lumenote app with routing and branding`

---

## Step 2 — Connect Supabase

**Goal:** App talks to a real backend.

- Create a [Supabase](https://supabase.com/dashboard) project.
- Copy Project URL + anon key → `.env` (from `.env.example`).
- Add `src/lib/supabase.js` client.
- Confirm `.env` is in `.gitignore`; commit `.env.example`.

**Verify:** Dev console shows no Supabase init errors; `isSupabaseConfigured()` returns true.

**Commit:** `chore: wire Supabase client and env config`

---

## Step 3 — Database schema + RLS

**Goal:** `notes` table exists with secure permissions.

- Run `supabase/schema.sql` in Supabase SQL Editor.
- Document schema in `docs/DATABASE.md`.
- Optionally seed 1–2 notes manually in Table Editor (with a test user).

**Verify:** Table appears in Supabase dashboard; RLS enabled; policies listed.

**Commit:** `feat: add notes schema with RLS policies`

---

## Step 4 — Read notes (authenticated)

**Goal:** Dashboard fetches user-specific notes from Supabase.

- Create `src/lib/notes.js` with `fetchNotes()`.
- Add `ProtectedRoute` — redirect anonymous users to `/login`.
- Dashboard calls `fetchNotes()` on mount; show loading + empty states.

**Verify:** Log in → dashboard loads (empty or seeded notes). Log out → `/dashboard` redirects to login.

**Commit:** `feat: read notes from Supabase with protected route`

---

## Step 5 — Authentication

**Goal:** Users can sign up, log in, log out; session persists.

- Build `Login` and `Register` pages with client-side validation.
- `AuthContext` with `signUp`, `signIn`, `signOut`, session listener.
- Navbar reflects auth state (email + sign out, or log in / sign up).

**Verify:**
- Sign up → lands on dashboard (or email confirm message).
- Reload → still logged in.
- Sign out → session clears; dashboard blocked.

**Commit:** `feat: auth (signup/login/logout) with AuthContext`

---

## Step 6 — Create & delete notes

**Goal:** Full write path for new notes.

- `createNote(userId, input)` and `deleteNote(noteId)` in `notes.js`.
- `NoteForm` component with title, body, color picker.
- Validation in `src/lib/validation.js` before API calls.
- Delete with confirmation dialog.

**Verify:**
- Create note → appears in grid immediately.
- Delete note → removed from UI and database (refresh confirms).
- Anonymous user cannot reach create form (protected route).

**Commit:** `feat: create and delete notes with validation`

---

## Step 7 — Update & pin notes

**Goal:** Edit existing notes; pin/unpin for sorting.

- `updateNote(noteId, updates)` in `notes.js`.
- Edit mode in dashboard (form pre-filled).
- Pin toggle updates `pinned` field; pinned notes sort to top.

**Verify:**
- Edit title/body → saves and persists on refresh.
- Pin note → moves to "Pinned" section.
- Unpin → returns to main list.

**Commit:** `feat: edit and pin notes`

---

## Step 8 — Polish & error handling

**Goal:** Production-feel UX.

- Map Supabase errors to user-friendly messages in `notes.js`.
- Form-level error display on auth and note forms.
- Responsive layout pass (mobile nav, note grid).
- "Supabase not configured" banner when env vars missing.

**Verify:**
- Submit empty title → validation error shown.
- Throttle network → loading state visible.
- Mobile viewport → layout usable.

**Commit:** `feat: error handling, loading states, and responsive polish`

---

## Step 9 — CI/CD deploy

**Goal:** Live app on GitHub Pages.

- Configure `.github/workflows/deploy.yml` (build on push to `main`).
- Add GitHub repo secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Enable GitHub Pages (Source: GitHub Actions).
- Set `VITE_BASE_PATH` to `/lumenote/` in workflow (or use `${{ github.event.repository.name }}/` if repo is named `lumenote`).

**Verify:**
- Push to `main` → Actions workflow succeeds.
- Live URL loads; sign up, create note, edit, delete all work.

**Commit:** `ci: deploy to GitHub Pages on push to main`

---

## Step 10 — Documentation & issues

**Goal:** Assignment deliverables complete.

- Finalize `README.md`, `PLAN.md`, `DIAGRAMS.md`, `docs/DATABASE.md`, `docs/ARCHITECTURE.md`.
- Create GitHub issues from `ISSUES.md`; close completed ones.
- Record 2–3 min demo video (register → login → CRUD).

**Verify:** README covers overview, design, architecture, setup, usage, deployment.

**Commit:** `docs: complete assignment documentation`

---

## Suggested commit recap

```
docs: finalize Lumenote plan and design mockup
feat: scaffold Lumenote app with routing and branding
chore: wire Supabase client and env config
feat: add notes schema with RLS policies
feat: read notes from Supabase with protected route
feat: auth (signup/login/logout) with AuthContext
feat: create and delete notes with validation
feat: edit and pin notes
feat: error handling, loading states, and responsive polish
ci: deploy to GitHub Pages on push to main
docs: complete assignment documentation
```
