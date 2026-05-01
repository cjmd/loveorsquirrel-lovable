
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}';

INSERT INTO storage.buckets (id, name, public)
VALUES ('task-images', 'task-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view task images"
ON storage.objects FOR SELECT
USING (bucket_id = 'task-images');

CREATE POLICY "Authenticated users can upload task images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'task-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own task images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'task-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own task images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'task-images' AND (storage.foldername(name))[1] = auth.uid()::text);
