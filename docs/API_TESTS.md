# Lumenote — API Documentation & Test Plan

Week 3 deliverable: document endpoints, run tests with **Postman** or **Thunder Client**, and verify auth, CRUD, AI, and error cases.

**Base URL:** `https://YOUR_PROJECT_REF.supabase.co` (from `.env` → `VITE_SUPABASE_URL`)

**Import ready-made tests:**


| File                                                                             | Tool                |
| -------------------------------------------------------------------------------- | ------------------- |
| [lumenote-api.postman_collection.json](./lumenote-api.postman_collection.json)   | Postman             |
| [lumenote-api.postman_environment.json](./lumenote-api.postman_environment.json) | Postman environment |


Thunder Client (VS Code/Cursor) can import the same Postman collection JSON.

---



## Common headers

Every Supabase request needs:


| Header          | Value                   | Required                                     |
| --------------- | ----------------------- | -------------------------------------------- |
| `apikey`        | Your anon public key    | Always                                       |
| `Authorization` | `Bearer <access_token>` | Auth, CRUD, AI (not for anonymous read test) |
| `Content-Type`  | `application/json`      | POST / PATCH                                 |
| `Prefer`        | `return=representation` | When you want the created/updated row back   |


Get `<access_token>` from **Auth → Log in** (Postman saves it to `ACCESS_TOKEN` automatically).

---



## 1. Auth endpoints



### 1.1 Sign up


|            |                   |
| ---------- | ----------------- |
| **Method** | `POST`            |
| **Route**  | `/auth/v1/signup` |


**Request body:**

```json
{
  "email": "test@example.com",
  "password": "testpass123"
}
```

**Success (200):**

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": { "id": "uuid", "email": "test@example.com" }
}
```

**Error (400):** weak password, invalid email, or user already exists.

---



### 1.2 Log in


|            |                                      |
| ---------- | ------------------------------------ |
| **Method** | `POST`                               |
| **Route**  | `/auth/v1/token?grant_type=password` |


**Request body:**

```json
{
  "email": "test@example.com",
  "password": "testpass123"
}
```

**Success (200):** same shape as sign up — save `access_token` for later requests.

**Error (400):** `{ "error": "invalid_grant", "error_description": "Invalid login credentials" }`

---



### 1.3 Get current user


|            |                                        |
| ---------- | -------------------------------------- |
| **Method** | `GET`                                  |
| **Route**  | `/auth/v1/user`                        |
| **Auth**   | `Authorization: Bearer <access_token>` |


**Success (200):**

```json
{
  "id": "uuid",
  "email": "test@example.com",
  "role": "authenticated"
}
```

**Error (401):** missing or expired JWT.

---



## 2. Notes CRUD (PostgREST)

Table: `notes` · RLS: users only access `user_id = auth.uid()`

### 2.1 Create


|            |                  |
| ---------- | ---------------- |
| **Method** | `POST`           |
| **Route**  | `/rest/v1/notes` |


**Request body:**

```json
{
  "user_id": "YOUR_USER_UUID",
  "title": "Study notes",
  "body": "React hooks recap",
  "color": "#2dd4bf",
  "pinned": false
}
```

**Success (201):** array with the new row.

**Errors:**


| Status | Cause                                                |
| ------ | ---------------------------------------------------- |
| 400    | Empty title, invalid color, body too long (DB CHECK) |
| 401    | Missing JWT                                          |
| 403    | RLS — `user_id` does not match JWT user              |


---



### 2.2 Read


|            |                           |
| ---------- | ------------------------- |
| **Method** | `GET`                     |
| **Route**  | `/rest/v1/notes?select=*` |


**Success (200):** array of the user's notes (newest first in app; API order depends on query).

**Unauthorized behavior:** request with `apikey` only (no JWT) → `200` with `[]` (RLS hides all rows).

---



### 2.3 Update


|            |                                 |
| ---------- | ------------------------------- |
| **Method** | `PATCH`                         |
| **Route**  | `/rest/v1/notes?id=eq.{noteId}` |


**Request body (partial):**

```json
{
  "title": "Updated title",
  "pinned": true
}
```

**Success (200):** array with updated row.

---



### 2.4 Delete


|            |                                 |
| ---------- | ------------------------------- |
| **Method** | `DELETE`                        |
| **Route**  | `/rest/v1/notes?id=eq.{noteId}` |


**Success (204):** empty body.

---



## 3. AI Edge Function


|            |                                        |
| ---------- | -------------------------------------- |
| **Method** | `POST`                                 |
| **Route**  | `/functions/v1/ai-notes`               |
| **Auth**   | `Authorization: Bearer <access_token>` |




### 3.1 Summarize

**Request:**

```json
{ "action": "summarize" }
```

**Success (200):**

```json
{
  "action": "summarize",
  "model": "gpt-4o-mini",
  "notesAnalyzed": 2,
  "result": {
    "overview": "...",
    "keyPoints": ["...", "..."],
    "followUps": ["...", "..."]
  }
}
```



### 3.2 Suggest

**Request:**

```json
{ "action": "suggest" }
```

**Success (200):**

```json
{
  "action": "suggest",
  "model": "gpt-4o-mini",
  "notesAnalyzed": 2,
  "result": {
    "suggestions": [
      {
        "title": "...",
        "rationale": "...",
        "starterText": "..."
      }
    ]
  }
}
```



### 3.3 AI error responses


| Status | Body example                                                                     | Cause                           |
| ------ | -------------------------------------------------------------------------------- | ------------------------------- |
| 401    | `{ "error": "Please log in before using AI features." }`                         | No JWT                          |
| 400    | `{ "error": "Create at least one note before using AI assistance." }`            | No notes                        |
| 400    | `{ "error": "Unsupported AI action." }`                                          | Bad `action` value              |
| 429    | `{ "error": "You have reached the hourly AI limit...", "code": "rate_limited" }` | >8 requests/hour                |
| 503    | `{ "error": "AI is not configured yet..." }`                                     | Missing `OPENAI_API_KEY` secret |


---



## 4. How to run tests in Postman

1. Install [Postman](https://www.postman.com/downloads/) (or use Thunder Client in VS Code/Cursor).
2. **Import** → `docs/lumenote-api.postman_collection.json`
3. **Import** → `docs/lumenote-api.postman_environment.json`
4. Edit environment variables:
  - `SUPABASE_URL` — from your `.env`
  - `SUPABASE_ANON_KEY` — from your `.env`
  - `TEST_EMAIL` / `TEST_PASSWORD` — a test account (use a unique email)
5. Run folder **Auth → Log in** (or Sign up once, then Log in).
6. Run **Auth → Get current user** (sets `USER_ID`).
7. Run **Notes CRUD** requests in order: Create → Read → Update → Delete.
8. Create at least one note in the app or via Postman, then run **AI Edge Function** tests.

Each request includes **Tests** tab assertions (green = pass).

---



## 4b. How to run tests in Thunder Client (Cursor / VS Code)

Thunder Client lives **inside Cursor** — no separate app needed.

### Step 1 — Install the extension

1. Open Cursor
2. Press **Cmd + Shift + X** (Extensions)
3. Search **Thunder Client**
4. Install **Thunder Client** by Ranga Vadhineni (lightning bolt icon)



### Step 2 — Open Thunder Client

1. Click the **Thunder Client** icon in the left Activity Bar (lightning bolt)
2. You’ll see tabs: **Activity**, **Collections**, **Env**, **Tests**



### Step 3 — Import the environment

1. Click the **Env** tab
2. Click the **Menu (⋯)** at the top → **Import**
3. Choose file:
  ```
   docs/thunder-client/thunder-environment_Lumenote Supabase.json
  ```
4. Click the **Lumenote Supabase** environment in the list to activate it (highlighted)



### Step 4 — Set your variables

1. With **Lumenote Supabase** selected, click **Edit** (pencil icon) or the **⋯** menu → **Edit**
2. Update these from your `.env` file:


| Variable            | Copy from                          |
| ------------------- | ---------------------------------- |
| `SUPABASE_URL`      | `VITE_SUPABASE_URL` in `.env`      |
| `SUPABASE_ANON_KEY` | `VITE_SUPABASE_ANON_KEY` in `.env` |
| `TEST_EMAIL`        | Your Lumenote login email          |
| `TEST_PASSWORD`     | Your Lumenote password             |


1. Leave `ACCESS_TOKEN`, `USER_ID`, and `NOTE_ID` **empty** — Thunder Client fills them after **Log in**
2. **Save**



### Step 5 — Import the collection

1. Click the **Collections** tab
2. Click **Menu (⋯)** → **Import**
3. Choose file:
  ```
   docs/thunder-client/thunder-collection_Lumenote Week 3 API.json
  ```
4. You should see **Lumenote Week 3 API** with folders: Auth, Notes CRUD, AI Edge Function

> **Note:** Import may require Thunder Client **Pro**. If Import is locked, use the Postman files in `docs/` instead, or create requests manually using the endpoint tables in sections 1–3 above.



### Step 6 — Run requests (same order as Postman)

Make sure **Lumenote Supabase** is the active environment (check **Env** tab — it should be selected).


| Order | Request                              | Expected                                           |
| ----- | ------------------------------------ | -------------------------------------------------- |
| 1     | **Auth → Log in**                    | Status **200**; saves `ACCESS_TOKEN` automatically |
| 2     | **Auth → Get current user**          | Status **200**                                     |
| 3     | **Notes CRUD → Create note**         | Status **201**                                     |
| 4     | **Notes CRUD → Read notes**          | Status **200**                                     |
| 5     | **Notes CRUD → Update note**         | Status **200**                                     |
| 6     | **Notes CRUD → Delete note**         | Status **204**                                     |
| 7     | **Notes CRUD → Read notes — no JWT** | Status **200**, empty `[]`                         |
| 8     | **AI → Summarize notes**             | Status **200** (need saved notes)                  |
| 9     | **AI → Suggest study notes**         | Status **200**                                     |


Click a request → click **Send** (top right of request panel).

### Step 7 — Check test results

After **Send**, open the **Tests** tab under the response:

- **Passed** (green) = test OK
- **Failed** (red) = check environment variables or run **Log in** first



### Postman


|               | Postman                            |     |
| ------------- | ---------------------------------- | --- |
| Where it runs | Separate app                       |     |
| Import files  | `docs/lumenote-api.postman_*.json` |     |
|               |                                    |     |


---



## 5. Test cases — Auth


| ID   | Test                 | Steps                                                      | Expected result             | Pass? |
| ---- | -------------------- | ---------------------------------------------------------- | --------------------------- | ----- |
| A-01 | Valid sign up        | POST `/auth/v1/signup` with valid email + 6+ char password | 200, returns `access_token` | ✓     |
| A-02 | Invalid email        | POST sign up with `not-an-email`                           | 400 error                   | ✓     |
| A-03 | Valid log in         | POST `/auth/v1/token?grant_type=password`                  | 200, `access_token` saved   | ✓     |
| A-04 | Wrong password       | POST log in with wrong password                            | 400 `invalid_grant`         | ✓     |
| A-05 | Get user with JWT    | GET `/auth/v1/user` with Bearer token                      | 200, email matches          | ☐     |
| A-06 | Get user without JWT | GET `/auth/v1/user` with no Authorization                  | 401                         | ✓     |
| A-07 | Protected route (UI) | Visit `/dashboard` while logged out                        | Redirect to `/login`        | ☐     |


---



## 6. Test cases — Notes CRUD


| ID   | Test                  | Steps                                       | Expected result                  | Pass? |
| ---- | --------------------- | ------------------------------------------- | -------------------------------- | ----- |
| C-01 | Create note           | POST `/rest/v1/notes` with valid body + JWT | 201, row returned                | ✓     |
| C-02 | Read notes            | GET `/rest/v1/notes?select=*` with JWT      | 200, array includes created note | ✓     |
| C-03 | Update note           | PATCH `/rest/v1/notes?id=eq.{id}`           | 200, title/pinned updated        | ✓     |
| C-04 | Delete note           | DELETE `/rest/v1/notes?id=eq.{id}`          | 204                              | ✓     |
| C-05 | Read after delete     | GET notes again                             | Note no longer in list           | ☐     |
| C-06 | Pin note (UI)         | Click Pin on dashboard                      | Note moves to Pinned section     | ☐     |
| C-07 | Persist after refresh | Reload page after create                    | Note still visible               | ☐     |


---



## 7. Test cases — Error & edge cases


| ID   | Test                   | Steps                                        | Expected result             | Pass? |
| ---- | ---------------------- | -------------------------------------------- | --------------------------- | ----- |
| E-01 | Empty title            | POST note with `"title": ""`                 | 400 (DB CHECK / validation) | ☐     |
| E-02 | Invalid color          | POST note with `"color": "red"`              | 400                         | ☐     |
| E-03 | No JWT read            | GET notes with `apikey` only                 | 200, empty array `[]`       | ✓     |
| E-04 | Wrong user_id          | POST note with another user's UUID           | 403 RLS violation           | ☐     |
| E-05 | AI no JWT              | POST `/functions/v1/ai-notes` without Bearer | 401                         | ✓     |
| E-06 | AI invalid action      | POST `{ "action": "invalid" }`               | 400                         | ☐     |
| E-07 | AI no notes            | POST summarize with zero saved notes         | 400 friendly message        | ☐     |
| E-08 | Client validation (UI) | Submit login with empty password             | Form error before API call  | ☐     |


---



## 8. Test cases — AI features


| ID    | Test               | Steps                                            | Expected result               | Pass? |
| ----- | ------------------ | ------------------------------------------------ | ----------------------------- | ----- |
| AI-01 | Summarize          | Save 2+ notes → POST `{ "action": "summarize" }` | 200, `overview` + `keyPoints` | ✓     |
| AI-02 | Suggest            | POST `{ "action": "suggest" }`                   | 200, `suggestions` array      | ✓     |
| AI-03 | Loading state (UI) | Click Summarize on dashboard                     | Spinner, then result or error | ☐     |
| AI-04 | Rate limit         | Run summarize 9+ times in one hour               | 429 on 9th request            | ☐     |


---



## 9. Test execution log (fill in after running)


| Date | Tester         | Tool    | Tests run        | Passed                | Notes               |
| ---- | -------------- | ------- | ---------------- | --------------------- | ------------------- |
| Jul 5, 2026 | Angelica Vides | Postman | Auth + CRUD + AI | All core tests passed | Delete returned 204 |


**Screenshot tip for submission:** capture Postman Collection Runner or individual green test results for A-03, C-01–C-04, E-03, E-05, AI-01.

---



## 10. Regression checklist

- [x] Auth session survives page refresh
- [x] `.env` is not committed (only `.env.example`)
- [x] OpenAI key is in Supabase secrets only
- [x] `npm run build` succeeds
- [x] Live Netlify URL loads dashboard + AI features

See also: [COST_ANALYSIS.md](./COST_ANALYSIS.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)