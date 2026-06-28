# Lumenote

A personal notes app for students and thinkers. Capture study notes, ideas, and reminders — all private to your account.

Built for the **Week 2 Full-Stack Assignment**: database integration, authentication, CRUD, CI/CD, and documentation.

> **Live URL:** _After deploy:_ `https://<username>.github.io/lumenote/`

> **Note:** This is the **Lumenote** app (Week 2). It is separate from the Week 1 portfolio project. Local folder: `lumenote/`.

---

## Project Overview

**Problem:** Learners need a simple, secure place to write and organize notes without setup overhead.

**Solution:** Lumenote provides email/password auth, a protected dashboard, and full CRUD on personal notes with pin and color organization.

**Stack:** React + Vite frontend · Supabase (PostgreSQL + Auth + RLS) · GitHub Actions → GitHub Pages

---

## Features

- **Authentication** — Sign up, log in, log out with persistent sessions (Supabase Auth)
- **Private notes** — Row Level Security ensures users only see their own data
- **CRUD** — Create, read, update, and delete notes with validation
- **Pin notes** — Important notes stay at the top
- **Color labels** — Visual organization (default, blue, green, amber, rose)
- **CI/CD** — Automatic deploy to GitHub Pages on push to `main`

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [PLAN.md](./PLAN.md) | Concept, scope, open decisions |
| [DESIGN.md](./DESIGN.md) | Design system, wireframes, iteration checklist |
| [DESIGN_LOG.md](./DESIGN_LOG.md) | Changelog of design iterations |
| [mockup.html](./mockup.html) | Interactive static mockup — iterate design here |
| [BUILD_STEPS.md](./BUILD_STEPS.md) | Incremental build steps with Verify checkpoints |
| [DIAGRAMS.md](./DIAGRAMS.md) | Mermaid ERD, flows, sequences, component hierarchy |
| [docs/DATABASE.md](./docs/DATABASE.md) | Schema, RLS, design decisions |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | How frontend, BaaS, and DB fit together |
| [ISSUES.md](./ISSUES.md) | GitHub issues and project board guide |

## Project Status

**Current phase: Step 2 complete** — Supabase client wired; next: [Step 3](./BUILD_STEPS.md) (run `supabase/schema.sql`).

```bash
npm run dev   # requires Node 18+
```

Then verify: landing → login → register → dashboard (dummy notes, local CRUD).

---

## Architecture (Summary)

```
React SPA  →  Supabase JS Client  →  Supabase Auth (JWT)
                                 →  PostgREST API  →  PostgreSQL (notes + RLS)
```

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) and [DIAGRAMS.md](./DIAGRAMS.md) for full diagrams.

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20 recommended)
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com/) account (free tier)
- GitHub account with [Classroom assignment](https://classroom.github.com/a/nUSqhsBz) accepted

---

## Installation & Setup

### 1. Clone your Classroom repository

```bash
git clone https://github.com/<your-org>/lumenote.git
cd lumenote
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open **SQL Editor** → run [`supabase/schema.sql`](./supabase/schema.sql)
3. **Authentication → Providers → Email** → disable **Confirm email** (recommended for local dev)
4. Copy **Project URL** and **anon public key** from **Settings → API**

### 4. Environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> Never commit `.env`. Only `.env.example` is tracked.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Usage Guide

### Register

1. Click **Sign up** on the landing page
2. Enter email, password (6+ chars), and confirm password
3. You are redirected to **My Notes** dashboard

### Log in

1. Click **Log in**
2. Enter credentials → dashboard loads your notes

### Create a note

1. On the dashboard, fill in **Title** and **Body**
2. Choose a **Color** label
3. Click **Save note** — it appears in the grid

### Edit a note

1. Click **Edit** on a note card
2. Update fields → **Save changes**

### Pin a note

Click **Pin** on a card — it moves to the **Pinned** section at the top.

### Delete a note

Click **Delete** → confirm — note is removed from the database.

### Sign out

Click **Sign out** in the nav — session clears; dashboard is no longer accessible.

---

## Deployment

### GitHub Actions (CI/CD)

Push to `main` triggers [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml):

1. Install dependencies (`npm ci`)
2. Build with Supabase env vars from secrets
3. Deploy `dist/` to GitHub Pages

### One-time GitHub setup

1. **Settings → Secrets and variables → Actions** — add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**

### Live URL

After a successful deploy:

```
https://<github-username>.github.io/lumenote/
```

Smoke-test: register → create note → edit → delete on the live URL.

---

## Project Structure

```
├── .github/workflows/deploy.yml   # CI/CD
├── docs/
│   ├── ARCHITECTURE.md
│   └── DATABASE.md
├── src/
│   ├── components/                  # Layout, NoteForm, NoteList, NoteCard
│   ├── context/AuthContext.jsx      # Auth state
│   ├── lib/                         # supabase, notes CRUD, validation
│   └── pages/                       # Home, Login, Register, Dashboard
├── supabase/schema.sql              # PostgreSQL schema + RLS
├── PLAN.md
├── BUILD_STEPS.md
├── DIAGRAMS.md
├── ISSUES.md
└── README.md
```

---

## Commit Convention

Use conventional commits aligned with build steps:

```
feat: scaffold Lumenote app with routing and branding
chore: wire Supabase client and env config
feat: add notes schema with RLS policies
feat: auth (signup/login/logout) with AuthContext
feat: create and delete notes with validation
ci: deploy to GitHub Pages on push to main
docs: complete assignment documentation
```

---

## Demo Video Checklist (2–3 min)

- [ ] Show landing page
- [ ] Register a new account
- [ ] Log out and log back in
- [ ] Create a note
- [ ] Edit and pin a note
- [ ] Delete a note
- [ ] Briefly show live deployed URL

---

## License

MIT — educational use.
# week2-Angelica-Vides
