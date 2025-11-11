-- Fix infinite recursion by using the existing is_workspace_member function
DROP POLICY IF EXISTS "Users can view members of their workspaces" ON workspace_members;

CREATE POLICY "Users can view members of their workspaces"
ON workspace_members
FOR SELECT
USING (
  is_workspace_member(workspace_id, auth.uid())
);