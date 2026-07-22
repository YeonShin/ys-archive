INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  TRUE,
  10485760,
  ARRAY[
    'image/png', 
    'image/jpeg', 
    'image/webp', 
    'image/svg+xml', 
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access for portfolio-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES 
  ('portfolio-assets', 'profile/.keep', NULL, '{"mimetype": "text/plain"}'),
  ('portfolio-assets', 'resumes/.keep', NULL, '{"mimetype": "text/plain"}'),
  ('portfolio-assets', 'projects/.keep', NULL, '{"mimetype": "text/plain"}')
ON CONFLICT (bucket_id, name) DO NOTHING;
