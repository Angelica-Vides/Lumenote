# Lumenote — Design Log

Record design iterations here. One entry per session or decision batch.

---

## Template

```markdown
### v0.x — YYYY-MM-DD — Short title
**Changed:** what you updated
**Why:** reason for the change
**Files:** mockup.html, DESIGN.md, PLAN.md
**Decisions closed:** D1, D4, …
```

---

## Entries

### v0.5 — Rename project folder portfolio → lumenote
**Changed:** Local directory renamed to `lumenote/`; docs use `lumenote` as repo name (distinct from Week 1 portfolio).
**Files:** README.md, .env.example, BUILD_STEPS.md

### v0.4 — Step 2 — Supabase client wired
**Changed:** Enhanced supabase.js, supabaseHealth.js, SupabaseStatus banner, .env.example docs.
**Verify:** With .env filled → banner shows "Supabase connected".

### v0.3 — 2026-06-23 — Step 1 scaffold (React app)
**Changed:** React app with teal v0.2 theme, routing (/, /login, /register, /dashboard), dummy-note dashboard with local CRUD, ColorPicker, EmptyState illustration.
**Why:** BUILD_STEPS Step 1 — scaffold frontend before Supabase.
**Files:** src/*, index.css, App.jsx
**Verify:** `npm run dev` → all routes load (Node 18+ required)

### v0.2 — 2026-06-23 — Teal accent + custom colors + empty state
**Changed:** Teal accent (`#2dd4bf`); custom note colors (hex + preset swatches); card grid confirmed; empty state with SVG illustration; pin button on card; email confirm off for dev.
**Why:** User design review — cooler palette, more personalization, clearer empty UX.
**Files:** mockup.html, DESIGN.md, PLAN.md §9, supabase/schema.sql, docs/DATABASE.md
**Decisions closed:** D1, D2, D3, D4, D5, D6, D7

### v0.1 — 2026-06-23 — Initial design draft
**Changed:** Created DESIGN.md, mockup.html with Landing / Login / Dashboard (Option A layout). Amber accent, dark theme, 5 note colors, card grid.
**Why:** Establish baseline for iteration before coding.
**Files:** DESIGN.md, mockup.html, PLAN.md (open decisions table)
**Decisions closed:** _(none yet — all TBD)_

---

<!-- Add new entries above this line as you iterate -->
