# Lumenote — Design Specification

Living design doc. Update this file and `mockup.html` as you iterate. Log changes in [DESIGN_LOG.md](./DESIGN_LOG.md).

**Design status:** v0.2 — decisions locked (see [PLAN.md §9](./PLAN.md#9-design-decisions-locked))

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

Card left border uses the note's stored color directly.

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

### 3b. Dashboard `/dashboard` — grid layout ✅

Form on top, **card grid** below. Pinned section first.

```
┌─────────────────────────────────────────────────────────────┐
│  My Notes                                    [ Refresh ]    │
│  ┌─ New note ──────────────────────────────────────────┐   │
│  │ Title · Body · [swatches] [custom color picker]      │   │
│  └──────────────────────────────────────────────────────┘   │
│  PINNED (1)                                                 │
│  ┌──────────┐ ┌──────────┐                                 │
│  │ note     │ │ note     │   ← card grid                   │
│  │ [Pin][Edit][Delete]    │                                 │
│  └──────────┘ └──────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

### 3c. Dashboard empty state ✅

When user has zero notes, hide the grid and show:

```
┌─────────────────────────────────────────────────────────────┐
│              [ SVG illustration — notebook + glow ]         │
│              No notes yet                                   │
│              Create your first note above to get started.   │
│              [ optional: subtle arrow pointing to form ]    │
└─────────────────────────────────────────────────────────────┘
```

Preview in mockup: **Dashboard (empty)** tab.

---

## 4. Component Inventory

| Component | Used on | Notes |
|-----------|---------|-------|
| `Layout` | All pages | Header, nav, footer |
| `Hero` | Landing | Teal accent on key word |
| `AuthCard` | Login, Register | Centered form |
| `NoteForm` | Dashboard | Preset swatches + custom color input |
| `NoteGrid` | Dashboard | Responsive card grid |
| `NoteCard` | Dashboard | Border color = note.color hex; **Pin button on card** |
| `EmptyState` | Dashboard | SVG illustration + copy |
| `ProtectedRoute` | Router | Redirect if anonymous |

---

## 5. Interaction Specs

| Interaction | Behavior |
|-------------|----------|
| **Create note** | Submit form → note appears in grid |
| **Custom color** | Pick swatch OR use color input → stored as `#RRGGBB` |
| **Edit note** | Edit button → form pre-fills including color |
| **Delete note** | Delete → confirm dialog |
| **Pin note** | **Pin button on card** → toggles pinned; pinned section sorts first |
| **Empty state** | Shown when `notes.length === 0` after load |
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
- [x] Dashboard: form + card grid
- [x] Note density: card grid
- [x] Custom note colors (hex + presets)
- [x] Pin: button on card
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
