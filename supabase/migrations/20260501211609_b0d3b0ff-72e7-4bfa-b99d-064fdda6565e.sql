ALTER TABLE public.notes
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived_at timestamp with time zone;