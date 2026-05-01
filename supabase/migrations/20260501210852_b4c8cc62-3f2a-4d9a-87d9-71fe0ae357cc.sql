CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workspace_id UUID,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workspace notes"
ON public.notes FOR SELECT
USING ((user_id = auth.uid()) OR is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Users can create workspace notes"
ON public.notes FOR INSERT
WITH CHECK ((user_id = auth.uid()) AND ((workspace_id IS NULL) OR is_workspace_member(workspace_id, auth.uid())));

CREATE POLICY "Users can update workspace notes"
ON public.notes FOR UPDATE
USING ((user_id = auth.uid()) OR is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Users can delete workspace notes"
ON public.notes FOR DELETE
USING ((user_id = auth.uid()) OR is_workspace_member(workspace_id, auth.uid()));

CREATE OR REPLACE FUNCTION public.set_updated_at_notes()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_notes();

ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;