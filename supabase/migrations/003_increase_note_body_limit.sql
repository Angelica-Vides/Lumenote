-- Increase note body storage for longer rich-text notes
-- Run once in Supabase SQL Editor if you already applied earlier migrations

ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_body_check;
ALTER TABLE notes ADD CONSTRAINT notes_body_check CHECK (char_length(body) <= 100000);
