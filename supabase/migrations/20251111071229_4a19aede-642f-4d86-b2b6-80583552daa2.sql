-- Fix infinite recursion in workspace_members SELECT policy
DROP POLICY IF EXISTS "Users can view members of their workspaces" ON workspace_members;

-- Create a new policy that doesn't cause recursion
-- Users can view workspace members if they own the workspace OR if they are a member
CREATE POLICY "Users can view members of their workspaces"
ON workspace_members
FOR SELECT
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
  OR
  user_id = auth.uid()
);