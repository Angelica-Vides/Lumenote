# Lumenote — Design Specification

Living design doc. Update this file and `mockup.html` as you iterate. Log changes in [DESIGN_LOG.md](./DESIGN_LOG.md).

**Design status:** v0.3 — tabbed dashboard, sticky notes, rich-text editor (see [PLAN.md §10](./PLAN.md#10-design-decisions-locked-v03))

---

## 1. Design Principles

| Principle | Meaning for Lumenote |
|-----------|----------------------|
| **Focused** | Minimal chrome; content (notes) is the hero |
| **Calm** | Dark, low-contrast UI for long study sessions |
| **Cool light** | Teal accent = "lumen" — clarity and focus without harsh brightness |
| **Private** | No social features; feels like a personal notebook |
| **Personal** | Custom note colors let users organize their way |

---

## 2. Design Tokens (v0.2 — teal)

> Edit these values in `mockup.html` `:root` block to preview changes instantly.

### Color

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0c0e12` | Page background |
| `--bg-glow` | `#0c1618` | Radial gradient (teal-tinted) |
| `--surface` | `#151922` | Cards, header |
| `--surface-hover` | `#1e2430` | Hover states |
| `--border` | `#2a3142` | Dividers, inputs |
| `--text` | `#eef1f6` | Primary text |
| `--muted` | `#8b95a8` | Secondary text |
| `--accent` | `#2dd4bf` | Brand, CTAs, logo mark |
| `--accent-hover` | `#14b8a6` | Button hover |
| `--accent-text` | `#042f2e` | Text on accent buttons |
| `--danger` | `#ef4444` | Delete actions |
| `--success` | `#22c55e` | Success messages |

### Note colors (custom)

Notes store a **hex color** (e.g. `#3b82f6`) in the database. The UI provides:

1. **Preset swatches** — quick picks (teal, blue, green, violet, rose, amber)
2. **Custom picker** — native `<input type="color">` for any hex value

Card background uses the note's stored **hex color** as sticky-note paper. Pinned notes show a **red pushpin** at the top-right corner.

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Logo | Inter | 1.25rem | 700 |
| H1 (hero) | Inter | clamp(2rem, 5vw, 2.75rem) | 700 |
| H1 (dashboard) | Inter | 1.75rem | 700 |
| Body | Inter | 1rem | 400 |
| Small / meta | Inter | 0.85rem | 400 |
| Label | Inter | 0.85rem | 500 |

### Spacing & shape

| Token | Value |
|-------|-------|
| `--radius` | `10px` |
| Container max-width | `960px` |
| Card padding | `1.25rem` |
| Grid gap | `1rem` |
| Note grid | `repeat(auto-fill, minmax(260px, 1fr))` |

---

## 3. Screen Wireframes

### 3a. Landing `/`

```
┌─────────────────────────────────────────────────────────────┐
│  ✦ Lumenote                    Log in    [ Sign up ]        │
├─────────────────────────────────────────────────────────────┤
│         Your ideas, illuminated  (teal accent word)         │
│         [ Get started free ]  [ Log in ]                    │
│         ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│         │ Private │ │ CRUD    │ │ Custom  │                │
│         └─────────┘ └─────────┘ └─────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### 3b. My Notes tab `/dashboard` ✅

Tab bar: **My Notes | New Note**. Notes appear as a **sticky-note grid** (pinned section first). AI assistant panel below the header.

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Lumenote                         user@  Sign out   │
│  [ My Notes ]  [ New Note ]                                 │
├─────────────────────────────────────────────────────────────┤
│  AI STUDY ASSISTANT  [ Summarize ] [ Suggest ]              │
│  PINNED (1)                                                 │
│  📌┌──────────┐ ┌──────────┐                               │
│    │ sticky   │ │ sticky   │   ← colored paper + tilt      │
│    │ note     │ │ note     │                               │
│    │ Pin Edit Delete          │                               │
│    └──────────┘ └──────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

### 3c. New Note tab `/notes/new` ✅

Rich-text editor (TipTap) with toolbar: bold, headings, bullet/numbered list styles, fonts, image upload. Character counter shown below editor.

### 3d. Dashboard empty state ✅

When user has zero notes on **My Notes**:

```
┌─────────────────────────────────────────────────────────────┐
│              [ SVG illustration — notebook + glow ]         │
│              No notes yet                                   │
│              Switch to the New Note tab to get started.       │
│              [ Create your first note ]                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Component Inventory

| Component | Used on | Notes |
|-----------|---------|-------|
| `Layout` | All pages | Header, logo → dashboard when logged in, footer |
| `NotesTabs` | Logged-in routes | My Notes \| New Note tab bar |
| `Hero` | Landing | Teal accent on key word |
| `AuthCard` | Login, Register | Centered form |
| `NoteForm` | New / Edit note pages | Title, color, wraps RichTextEditor |
| `RichTextEditor` | NoteForm | TipTap toolbar + character counter |
| `NoteList` | Dashboard | Pinned + all notes sections |
| `NoteCard` | Dashboard | Sticky-note style; pin badge when pinned |
| `EmptyState` | Dashboard | SVG illustration + link to New Note |
| `AiAssistant` | Dashboard | Summarize + suggest AI features |
| `ProtectedRoute` | Router | Redirect if anonymous |

---

## 5. Interaction Specs

| Interaction | Behavior |
|-------------|----------|
| **Create note** | New Note tab → save → redirect to My Notes grid |
| **Custom color** | Pick swatch OR use color input → sticky-note paper color |
| **Edit note** | Edit on card → `/notes/:id/edit` page |
| **Delete note** | Delete → confirm dialog |
| **Pin note** | Pin button on card → pushpin badge; pinned section sorts first |
| **Rich text** | TipTap toolbar; list style dropdowns; image upload to Storage |
| **Empty state** | Shown when `notes.length === 0` on My Notes tab |
| **Auth (dev)** | Email confirmation **disabled** in Supabase |

---

## 6. Responsive Breakpoints

| Breakpoint | Layout changes |
|------------|----------------|
| `> 600px` | Full nav with email; note grid 2–3 columns |
| `≤ 600px` | Hide email in nav; single-column grid |

---

## 7. Design Checklist

- [x] Accent color: teal
- [x] Dashboard: My Notes tab + separate New Note tab
- [x] Note density: sticky-note card grid
- [x] Custom note colors (hex + presets)
- [x] Rich-text editor with character counter
- [x] Pin: button + corner pushpin badge
- [x] Empty state: illustration
- [x] Email confirm: off for dev
- [x] Final review of mockup in browser
- [x] Sign-off → BUILD_STEPS Step 1

---

## 8. Preview

```bash
open mockup.html
```

Tabs: Landing · Login · Register · Dashboard · **Dashboard (empty)**
