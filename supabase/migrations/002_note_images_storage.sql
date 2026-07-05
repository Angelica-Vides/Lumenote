-- Rich notes: image uploads + larger HTML body
-- Run once in Supabase SQL Editor after 001_ai_requests.sql

ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_body_check;
ALTER TABLE notes ADD CONSTRAINT notes_body_check CHECK (char_length(body) <= 50000);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'note-images',
  'note-images',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Users can upload own note images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own note images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own note images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view note images" ON storage.objects;

CREATE POLICY "Users can upload own note images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'note-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own note images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'note-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own note images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'note-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view note images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'note-images');
