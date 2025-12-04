-- Add name column to workspaces table
ALTER TABLE public.workspaces 
ADD COLUMN name text NOT NULL DEFAULT 'My Workspace';

-- Allow workspace owners to update their workspaces (for renaming)
CREATE POLICY "Workspace owners can update their workspace"
ON public.workspaces
FOR UPDATE
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());