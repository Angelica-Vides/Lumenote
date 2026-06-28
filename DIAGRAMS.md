# Lumenote — Diagrams

Mermaid diagrams for architecture, flows, and data model. View in GitHub, VS Code, or any Mermaid-capable Markdown previewer.

---

## 1. Flow Diagrams

### 1a. System / Data Flow

```mermaid
flowchart LR
    subgraph Client["React + Vite Frontend"]
        UI[Lumenote UI]
        SDK[Supabase JS Client]
        CTX[AuthContext]
    end

    subgraph Supabase["Supabase (BaaS)"]
        AUTH[Auth Service]
        API[PostgREST API]
        DB[(PostgreSQL + RLS)]
    end

    UI --> CTX
    UI --> SDK
    CTX -->|signUp / signIn / signOut| AUTH
    SDK -->|CRUD notes| API
    AUTH -->|JWT session| SDK
    API --> DB
    DB -->|user-scoped rows| API
    API --> SDK --> UI
```

### 1b. User Journey

```mermaid
flowchart TD
    A([Visit Lumenote]) --> B{Logged in?}
    B -- No --> C[View landing page]
    C --> D{Want to manage notes?}
    D -- Yes --> E[Sign up or Log in]
    E --> F[Authenticated session]
    D -- No --> C
    B -- Yes --> F
    F --> G[Open Dashboard]
    G --> H[Create note]
    G --> I[Edit / pin note]
    G --> J[Delete note]
    H --> G
    I --> G
    J --> G
    F --> K[Sign out]
    K --> C
```

### 1c. Note CRUD Flow

```mermaid
flowchart TD
    START([User on Dashboard]) --> ACTION{Action?}
    ACTION -->|Create| VAL1[Validate title/body/color]
    VAL1 -->|Invalid| ERR[Show form error]
    VAL1 -->|Valid| INS[INSERT into notes]
    INS --> REFRESH[Update local state]
    ACTION -->|Read| SEL[SELECT notes WHERE user_id = auth.uid]
    SEL --> REFRESH
    ACTION -->|Update| VAL2[Validate changes]
    VAL2 --> UPD[UPDATE note by id]
    UPD --> REFRESH
    ACTION -->|Delete| CONF{Confirm?}
    CONF -- No --> START
    CONF -- Yes --> DEL[DELETE note by id]
    DEL --> REFRESH
    REFRESH --> START
    ERR --> START
```

---

## 2. State Diagrams

### 2a. Authentication Session

```mermaid
stateDiagram-v2
    [*] --> Anonymous
    Anonymous --> Authenticating: submit login / signup
    Authenticating --> Authenticated: success (JWT stored)
    Authenticating --> Anonymous: error
    Authenticated --> Anonymous: sign out / session expired
    Authenticated --> [*]
```

### 2b. Dashboard View Mode

```mermaid
stateDiagram-v2
    [*] --> ListView
    ListView --> CreateMode: focus new note form
    ListView --> EditMode: click Edit on card
    EditMode --> ListView: save or cancel
    CreateMode --> ListView: note created
    ListView --> ListView: pin / delete / refresh
```

---

## 3. Entity-Relationship Diagram

```mermaid
erDiagram
    AUTH_USERS ||--o{ NOTES : owns

    AUTH_USERS {
        uuid id PK
        string email
        timestamptz created_at
    }

    NOTES {
        uuid id PK
        uuid user_id FK
        string title
        text body
        enum color
        boolean pinned
        timestamptz created_at
        timestamptz updated_at
    }
```

---

## 4. Deployment Topology

```mermaid
flowchart TB
    subgraph GitHub["GitHub Classroom Repo"]
        CODE[Source code]
        ACTIONS[GitHub Actions]
        PAGES[GitHub Pages]
    end

    subgraph SupabaseCloud["Supabase Cloud"]
        AUTH2[Auth]
        PG[(PostgreSQL)]
    end

    DEV([Developer]) -->|git push main| CODE
    CODE --> ACTIONS
    ACTIONS -->|npm run build| PAGES
    USER([Browser]) --> PAGES
    USER -->|HTTPS + JWT| AUTH2
    USER -->|CRUD API| PG
    AUTH2 --> PG
```

---

## 5. Sequence Diagram — Create Note

```mermaid
sequenceDiagram
    actor U as User
    participant UI as Dashboard
    participant VAL as validation.js
    participant API as notes.js
    participant SB as Supabase
    participant DB as PostgreSQL

    U->>UI: fill form + click Save
    UI->>VAL: validateNote(input)
    alt invalid
        VAL-->>UI: error message
        UI-->>U: show form error
    else valid
        VAL-->>API: proceed
        API->>SB: insert({ user_id, title, body, color })
        SB->>DB: INSERT (RLS checks auth.uid() = user_id)
        DB-->>SB: new row
        SB-->>API: created note
        API-->>UI: note object
        UI-->>U: note appears in grid
    end
```

---

## 6. Sequence Diagram — Protected Route

```mermaid
sequenceDiagram
    actor U as User
    participant RT as ProtectedRoute
    participant CTX as AuthContext
    participant SB as Supabase Auth

    U->>RT: navigate to /dashboard
    RT->>CTX: user, loading?
    alt loading
        RT-->>U: show Loading…
    else no user
        RT-->>U: redirect to /login
    else authenticated
        CTX->>SB: session valid
        RT-->>U: render Dashboard
    end
```

---

## 7. Frontend Component Hierarchy

```mermaid
flowchart TD
    APP[App] --> AUTHP[AuthProvider]
    AUTHP --> RT[BrowserRouter]
    RT --> LAYOUT[Layout]
    LAYOUT --> NAV[Header / Nav]
    RT --> ROUTES[Routes]

    ROUTES --> HOME[Home]
    ROUTES --> LOGIN[Login]
    ROUTES --> REGISTER[Register]
    ROUTES --> PROTECT[ProtectedRoute]
    PROTECT --> DASH[Dashboard]

    DASH --> FORM[NoteForm]
    DASH --> LIST[NoteList]
    LIST --> CARD[NoteCard]
```

---

## 8. RLS Permission Matrix

```mermaid
flowchart LR
    subgraph Policies["notes table RLS"]
        P1[SELECT: auth.uid = user_id]
        P2[INSERT: auth.uid = user_id]
        P3[UPDATE: auth.uid = user_id]
        P4[DELETE: auth.uid = user_id]
    end

    ANON[Anonymous JWT] -->|denied| Policies
    USER[Authenticated user] -->|own rows only| Policies
```
