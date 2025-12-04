-- Drop and recreate the INSERT policy with explicit settings
DROP POLICY IF EXISTS "Users can create their own workspace" ON public.workspaces;

CREATE POLICY "Users can create their own workspace"
ON public.workspaces
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());