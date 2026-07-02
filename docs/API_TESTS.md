# Lumenote API And Test Notes

This project uses Supabase-generated APIs for authentication and notes CRUD, plus one custom Supabase Edge Function for AI features.

## Endpoints

### Auth

Provider: Supabase Auth through `@supabase/supabase-js`.

- Sign up: `supabase.auth.signUp({ email, password })`
- Log in: `supabase.auth.signInWithPassword({ email, password })`
- Log out: `supabase.auth.signOut()`
- Session: `supabase.auth.getSession()` and `onAuthStateChange`

Expected behavior:

- Invalid email or password returns a friendly form error.
- Successful auth stores a Supabase session and allows access to `/dashboard`.
- Signed-out users are redirected away from protected routes.

### Notes CRUD

Provider: Supabase PostgREST generated from the `notes` table.

- Create: `POST /rest/v1/notes`
- Read: `GET /rest/v1/notes`
- Update: `PATCH /rest/v1/notes?id=eq.{noteId}`
- Delete: `DELETE /rest/v1/notes?id=eq.{noteId}`

Request fields:

- `title`: required text, 1-120 characters
- `body`: optional text, max 10,000 characters
- `color`: required hex color, format `#RRGGBB`
- `pinned`: boolean

Security:

- All requests require the authenticated user JWT.
- Row Level Security limits every CRUD operation to `auth.uid() = user_id`.

### AI Notes Function

Endpoint: `POST /functions/v1/ai-notes`

Headers:

```http
Authorization: Bearer <supabase-access-token>
Content-Type: application/json
```

Summarize request:

```json
{
  "action": "summarize"
}
```

Summarize response:

```json
{
  "action": "summarize",
  "model": "gpt-4o-mini",
  "notesAnalyzed": 3,
  "result": {
    "overview": "Short overview of the user's notes.",
    "keyPoints": ["Point one", "Point two"],
    "followUps": ["Review topic A", "Create a note about topic B"]
  }
}
```

Suggestion request:

```json
{
  "action": "suggest"
}
```

Suggestion response:

```json
{
  "action": "suggest",
  "model": "gpt-4o-mini",
  "notesAnalyzed": 3,
  "result": {
    "suggestions": [
      {
        "title": "Next study note title",
        "rationale": "Why this would help.",
        "starterText": "A useful first sentence."
      }
    ]
  }
}
```

Error responses:

- `401`: user is not logged in or session expired
- `400`: unsupported action or no notes exist yet
- `429`: hourly AI request limit reached
- `503`: AI provider or function configuration unavailable

## Manual Test Cases

Use the browser for UI flows and Postman, Thunder Client, or Supabase API docs for direct endpoint checks.

1. Register a new account with a valid email and 6+ character password.
2. Try registering with an invalid email and confirm the form shows an error.
3. Log out, visit `/dashboard`, and confirm the app redirects to `/login`.
4. Log in and create a note with title, body, and color.
5. Edit the note title/body and confirm the updated card persists after refresh.
6. Pin and unpin the note and confirm the list order changes.
7. Delete the note and confirm it disappears after refresh.
8. Create two notes, click **Summarize notes**, and confirm a loading state appears before the AI result.
9. Click **Suggest study notes** and confirm the AI suggestions are based on saved notes.
10. Temporarily remove `OPENAI_API_KEY` from function secrets in a test project and confirm the UI shows a friendly AI configuration error.
11. Call the AI function more than 8 times in one hour with the same user and confirm the `429` rate-limit message.
12. Attempt notes API access with no JWT and confirm RLS blocks protected data.

## Basic Regression Checklist

- Auth state survives page refresh.
- `.env` is not committed.
- Supabase anon key is the only browser-exposed key.
- OpenAI key exists only as a Supabase Edge Function secret.
- `npm run build` completes successfully.
