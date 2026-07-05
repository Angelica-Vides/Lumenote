-- Week 3: AI rate-limit tracking (run once in Supabase SQL Editor)
-- Safe to run on an existing Lumenote project — does not touch notes data.

CREATE TABLE IF NOT EXISTS ai_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('summarize', 'suggest')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_requests_user_created_idx ON ai_requests(user_id, created_at DESC);

ALTER TABLE ai_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI request log"
  ON ai_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI request log"
  ON ai_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);
