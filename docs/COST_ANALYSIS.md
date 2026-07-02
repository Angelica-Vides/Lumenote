# Lumenote AI Cost Analysis

Lumenote uses the OpenAI API from a Supabase Edge Function. The browser never receives the OpenAI API key.

## Current AI Usage

The app has two AI actions:

- **Summarize notes:** sends up to the user’s 25 most recent notes and asks for an overview, key points, and follow-up actions.
- **Suggest study notes:** sends the same note context and asks for personalized next-note ideas.

The default model is `gpt-4o-mini`, configured by the optional `OPENAI_MODEL` Supabase secret.

## Cost Assumptions

Actual pricing can change, so final cost should be checked against the current OpenAI pricing page before submission.

Estimated request size:

- Input: 2,000-5,000 tokens for a typical set of notes
- Output: 300-700 tokens for a compact JSON response
- Model: `gpt-4o-mini`

Expected student/demo usage:

- 10-30 AI calls while testing and recording the demo
- 2 AI calls in the final demo flow
- Less than $1 expected for normal Week 3 development/demo usage with `gpt-4o-mini`

## Cost Controls

Lumenote includes a per-user rate limit in the `ai-notes` Edge Function:

- Limit: 8 AI requests per authenticated user per hour
- Storage: `ai_requests` table in Supabase
- User experience: a `429` response becomes a friendly inline message

Other safeguards:

- The function only sends the current authenticated user’s notes.
- The function limits context to 25 notes per request.
- Secrets are stored in Supabase, not in frontend environment variables.
- AI failures are handled without breaking notes CRUD.

## Production Notes

For a larger public launch, improve cost controls by adding:

- A daily per-user cap
- Admin monitoring for total AI requests
- Shorter note excerpts for very large notes
- A billing alert in the OpenAI dashboard
