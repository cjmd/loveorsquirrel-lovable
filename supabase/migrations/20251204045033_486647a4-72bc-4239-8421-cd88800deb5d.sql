-- Drop all existing policies on workspaces table
DROP POLICY IF EXISTS "Users can create their own workspace" ON public.workspaces;
DROP POLICY IF EXISTS "Users can view workspaces they're members of" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can update their workspace" ON public.workspaces;

-- Recreate all policies fresh
CREATE POLICY "Users can create their own workspace"
ON public.workspaces
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can view workspaces they're members of"
ON public.workspaces
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (is_workspace_member(id, auth.uid()));

CREATE POLICY "Workspace owners can update their workspace"
ON public.workspaces
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());