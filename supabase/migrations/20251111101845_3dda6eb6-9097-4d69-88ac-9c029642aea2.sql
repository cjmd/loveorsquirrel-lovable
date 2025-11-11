-- Fix workspaces policy to avoid infinite recursion
DROP POLICY IF EXISTS "Users can view workspaces they're members of" ON workspaces;

CREATE POLICY "Users can view workspaces they're members of"
ON workspaces
FOR SELECT
USING (
  -- Use the existing security definer function
  is_workspace_member(id, auth.uid())
);