# Lumenote

A personal notes app for students and thinkers. Capture study notes, ideas, and reminders — all private to your account.

Built for the **Week 3 AI API & Mini-Project Gate**: AI integration, Supabase backend, authentication, CRUD, deployment, testing notes, and documentation.

**Student:** Angelica Vides  
**Z-number:** Z23515404  
**FAU email:** avides2019@fau.edu

> **Live URL:**
>
>  [https://lumenote-angelica-vides.netlify.app](https://lumenote-angelica-vides.netlify.app/)

> **Demo Video URL:** TODO: replace with the Week 3 3-5 minute demo video after recording  
> [https://youtu.be/LH4xtiiTwuk](https://youtu.be/LH4xtiiTwuk)
>
> **Note:** This is the **Lumenote** app (Week 3). It is an updated version of the week 2 app. Local folder: `lumenote/`.

---



## Project Overview

**Problem:** Learners need a simple, secure place to write and organize notes without setup overhead.

**Solution:** Lumenote provides email/password auth, a protected dashboard, full CRUD on personal notes, and AI-powered study support that summarizes saved notes and suggests useful next notes.

**Stack:** React + Vite frontend · Supabase (PostgreSQL + Auth + RLS + Edge Functions) · OpenAI API · Netlify (manual CLI deploy) · GitHub Actions workflow in repo

---



## Features

- **Authentication** — Sign up, log in, log out with persistent sessions (Supabase Auth)
- **Private notes** — Row Level Security ensures users only see their own data
- **CRUD** — Create, read, update, and delete notes with validation
- **Pin notes** — Important notes stay at the top
- **Color labels** — Visual organization (default, blue, green, amber, rose)
- **AI summaries** — Summarize the authenticated user’s saved notes into an overview, key points, and follow-ups
- **AI suggestions** — Generate personalized study notes/tasks from the user’s existing note content
- **AI safety UX** — Loading states, API failure messages, and hourly rate-limit handling through Supabase
- **CI/CD** — Automatic deploy to GitHub Pages on push to `main`

---



## Documentation Index


| Document                                         | Description                                        |
| ------------------------------------------------ | -------------------------------------------------- |
| [PLAN.md](./PLAN.md)                             | Concept, scope, open decisions                     |
| [DESIGN.md](./DESIGN.md)                         | Design system, wireframes, iteration checklist     |
| [DESIGN_LOG.md](./DESIGN_LOG.md)                 | Changelog of design iterations                     |
| [mockup.html](./mockup.html)                     | Interactive static mockup — iterate design here    |
| [BUILD_STEPS.md](./BUILD_STEPS.md)               | Incremental build steps with Verify checkpoints    |
| [DIAGRAMS.md](./DIAGRAMS.md)                     | Mermaid ERD, flows, sequences, component hierarchy |
| [docs/DATABASE.md](./docs/DATABASE.md)           | Schema, RLS, design decisions                      |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)   | How frontend, BaaS, and DB fit together            |
| [docs/API_TESTS.md](./docs/API_TESTS.md)         | Endpoint docs and Postman test plan                |
| [docs/COST_ANALYSIS.md](./docs/COST_ANALYSIS.md) | AI API usage and cost estimate                     |
| [ISSUES.md](./ISSUES.md)                         | GitHub issues and project board guide              |




## Project Status

**Current phase: Week 3 implementation complete in code** — run the latest `supabase/schema.sql`, deploy the `ai-notes` Edge Function, add the OpenAI secret in Supabase, then redeploy the frontend.

```bash
npm run dev   # requires Node 18+
```

Then verify: landing → register/login → dashboard → CRUD notes → AI summarize → AI suggestions.

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
- GitHub account with [Week 3 Classroom assignment](https://classroom.github.com/a/xoGDf7FJ) accepted

---



## Installation & Setup



### 1. Clone your Classroom repository

```bash
git clone https://github.com/FAU-AI-HootCamp-Summer-2026/week3-Angelica-Vides.git
cd week3-Angelica-Vides
```



### 2. Install dependencies

```bash
npm install
```



### 3. Configure Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open **SQL Editor** → run `[supabase/schema.sql](./supabase/schema.sql)`
3. **Authentication → Providers → Email** → disable **Confirm email** (recommended for local dev)
4. Copy **Project URL** and **anon public key** from **Settings → API**
5. Deploy the AI Edge Function:
  ```bash
   supabase functions deploy ai-notes
  ```
6. Add the OpenAI secret to Supabase (never put this in `VITE_*` browser env vars):
  ```bash
   supabase secrets set OPENAI_API_KEY=sk-...
   supabase secrets set OPENAI_MODEL=gpt-4o-mini
  ```



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
> `OPENAI_API_KEY` belongs in Supabase Edge Function secrets, not in `.env`.



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

### Use AI study tools

1. Create at least one note
2. Click **Summarize notes** to generate an overview, key points, and follow-up actions
3. Click **Suggest study notes** to generate personalized next-note ideas from saved content
4. If the API is unavailable or rate limited, Lumenote shows a friendly inline error



### Sign out

Click **Sign out** in the nav — session clears; dashboard is no longer accessible.

---



## Deployment

**Recommended: Netlify manual CLI** (meets “deploy to cloud” requirement without auto-deploy on every push).

### Netlify — manual CLI deploy (recommended)

Uses your local `.env` at build time. **Do not** connect GitHub auto-deploy in Netlify — that uses credits on every push. Deploy only when you choose.

#### One-time setup

1. Create a free account at [netlify.com](https://www.netlify.com/)
2. Install the CLI and log in:
  ```bash
   npm install -g netlify-cli
   netlify login
  ```
3. Link this project to a new Netlify site (say **No** to continuous deployment / GitHub auto-build):
  ```bash
   cd /path/to/lumenote
   netlify init
  ```
   Choose **Create & configure a new project** and pick a site name (e.g. `lumenote-angelica-vides`).
4. **Supabase Auth URLs** — in [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication → URL Configuration**:
  - **Site URL:** `https://YOUR-SITE-NAME.netlify.app`
  - **Redirect URLs:** add `https://YOUR-SITE-NAME.netlify.app/`**



#### Deploy (whenever you want an updated live site)

```bash
nvm use 20
npm run deploy:netlify
```

The CLI prints your live URL, e.g. `https://lumenote-angelica-vides.netlify.app`

Put that URL at the top of this README and use it in your demo video.

#### Why manual?


| Approach                                            | Credits / cost                                 |
| --------------------------------------------------- | ---------------------------------------------- |
| **Manual CLI** (`npm run deploy:netlify`)           | You deploy only when you run the command       |
| **Netlify + GitHub auto-deploy**                    | Builds on every push — uses free tier fast     |
| **GitHub Actions** (`.github/workflows/deploy.yml`) | Free for public repos; optional if Pages works |


Your repo still includes the GitHub Actions workflow for CI/CD credit — it shows you configured automated deploy even if the Classroom org blocks GitHub Pages.

---



### GitHub Pages (alternatives)

Option A — GitHub Actions · Option B — gh-pages branch

**Option A — GitHub Actions**

1. **Settings → Pages → Source → GitHub Actions**
2. Add secrets `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Push to `main`

**Option B — Deploy from a branch**

```bash
npm run deploy:pages
```

Instructor sets **Pages → Deploy from branch →** `gh-pages` **/ root**

Live URL: `https://fau-ai-hootcamp-summer-2026.github.io/week3-Angelica-Vides/`

---



### Demo video (3–5 min)

Record on your **Netlify live URL** (best) or `http://localhost:5173`.

**Show in order:**

1. Landing page
2. Sign up → dashboard
3. Create a note (title, body, color)
4. Edit the note
5. Pin the note
6. Run **Summarize notes**
7. Run **Suggest study notes**
8. Delete the note
9. Sign out → `/dashboard` redirects to login
10. Briefly show the live URL in the browser address bar



### Troubleshooting


| Problem                                  | Fix                                                              |
| ---------------------------------------- | ---------------------------------------------------------------- |
| Blank page after refresh on `/dashboard` | `netlify.toml` + `public/_redirects` SPA rules (already in repo) |
| Auth fails on live site                  | Add Netlify URL to Supabase **Redirect URLs**                    |
| `netlify: command not found`             | `npm install -g netlify-cli` or use `npx netlify-cli`            |
| Build fails                              | `nvm use 20` then ensure `.env` has Supabase keys                |


---



## Project Structure

```
├── .github/workflows/deploy.yml   # CI/CD
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_TESTS.md
│   ├── COST_ANALYSIS.md
│   ├── DATABASE.md
│   ├── lumenote-api.postman_collection.json
│   └── lumenote-api.postman_environment.json
├── src/
│   ├── components/                  # Layout, NoteForm, NoteList, NoteCard
│   ├── context/AuthContext.jsx      # Auth state
│   ├── lib/                         # supabase, notes CRUD, validation
│   └── pages/                       # Home, Login, Register, Dashboard
├── supabase/
│   ├── functions/ai-notes/           # Authenticated AI endpoint
│   └── schema.sql                    # PostgreSQL schema + RLS
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



## Demo Video Checklist (3–5 min)

- [ ] Show landing page
- [ ] Register a new account
- [ ] Log out and log back in
- [ ] Create a note
- [ ] Edit and pin a note
- [ ] Generate an AI summary
- [ ] Generate AI study suggestions
- [ ] Delete a note
- [ ] Briefly show live deployed URL

---



## License

MIT — educational use.