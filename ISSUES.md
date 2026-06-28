# Lumenote — GitHub Issues & Project Board

Use this file to create issues in your GitHub Classroom repo and track progress on a **Project board** (Kanban: Todo → In Progress → Done).

## How to set up the project board

1. In your GitHub repo, go to **Projects** → **New project** → **Board**.
2. Create columns: **Backlog**, **In Progress**, **Done**.
3. Create the issues below (copy title + body).
4. Move issues to **Done** as you complete each build step.

---

## Issues to create

### Issue #1 — Scaffold frontend
**Labels:** `feat`, `step-0`  
**Body:**
```
- [ ] Vite + React + React Router
- [ ] Layout, Home, route placeholders
- [ ] Lumenote dark theme (amber accent)

Verify: npm run dev shows landing page
Ref: BUILD_STEPS.md Step 0
```
**Status:** Done (if code is in repo)

---

### Issue #2 — Connect Supabase
**Labels:** `chore`, `step-1`  
**Body:**
```
- [ ] Create Supabase project
- [ ] Add src/lib/supabase.js
- [ ] .env.example + .gitignore for .env

Verify: isSupabaseConfigured() true with real keys
Ref: BUILD_STEPS.md Step 1
```

---

### Issue #3 — Database schema + RLS
**Labels:** `feat`, `database`, `step-2`  
**Body:**
```
- [ ] Run supabase/schema.sql
- [ ] Document in docs/DATABASE.md
- [ ] Confirm RLS policies in dashboard

Verify: notes table exists, RLS enabled
Ref: BUILD_STEPS.md Step 2
```

---

### Issue #4 — Read notes + protected route
**Labels:** `feat`, `step-3`  
**Body:**
```
- [ ] fetchNotes() in src/lib/notes.js
- [ ] ProtectedRoute component
- [ ] Dashboard loading + empty states

Verify: /dashboard requires login; notes load for auth user
Ref: BUILD_STEPS.md Step 3
```

---

### Issue #5 — Authentication
**Labels:** `feat`, `auth`, `step-4`  
**Body:**
```
- [ ] Login + Register pages
- [ ] AuthContext (signUp, signIn, signOut)
- [ ] Session persists on reload

Verify: sign up → dashboard; sign out → blocked
Ref: BUILD_STEPS.md Step 4
```

---

### Issue #6 — Create & delete notes
**Labels:** `feat`, `crud`, `step-5`  
**Body:**
```
- [ ] createNote, deleteNote
- [ ] NoteForm component
- [ ] Client validation

Verify: create + delete persist after refresh
Ref: BUILD_STEPS.md Step 5
```

---

### Issue #7 — Edit & pin notes
**Labels:** `feat`, `crud`, `step-6`  
**Body:**
```
- [ ] updateNote
- [ ] Edit mode in dashboard
- [ ] Pin/unpin with sort order

Verify: edit saves; pinned notes appear first
Ref: BUILD_STEPS.md Step 6
```

---

### Issue #8 — Polish & error handling
**Labels:** `feat`, `step-7`  
**Body:**
```
- [ ] User-friendly error messages
- [ ] Loading states
- [ ] Responsive layout

Verify: validation errors show; mobile layout OK
Ref: BUILD_STEPS.md Step 7
```

---

### Issue #9 — CI/CD deploy
**Labels:** `ci`, `step-8`  
**Body:**
```
- [ ] GitHub Actions workflow
- [ ] Repo secrets for Supabase env vars
- [ ] GitHub Pages enabled

Verify: push to main deploys; live URL works
Ref: BUILD_STEPS.md Step 8
```

---

### Issue #10 — Documentation
**Labels:** `docs`, `step-9`  
**Body:**
```
- [ ] README complete
- [ ] PLAN.md, BUILD_STEPS.md, DIAGRAMS.md
- [ ] Demo video (2-3 min)

Verify: all assignment doc sections present
Ref: BUILD_STEPS.md Step 9
```

---

## Backlog (post-MVP)

| Issue | Title | Description |
|-------|-------|-------------|
| #11 | Google OAuth | Add social login via Supabase Auth |
| #12 | Search notes | Filter by title/body text |
| #13 | Tags / folders | Organize notes beyond color |
| #14 | Markdown preview | Render note body as Markdown |

---

## Suggested project board layout

| Backlog | In Progress | Done |
|---------|-------------|------|
| #11 Google OAuth | — | #1 Scaffold |
| #12 Search | — | #2 Supabase |
| #13 Tags | — | … |
| #14 Markdown | — | #10 Docs |

Close each issue with a comment linking the commit that completed it, e.g. `Closed by abc1234 — feat: auth`.
