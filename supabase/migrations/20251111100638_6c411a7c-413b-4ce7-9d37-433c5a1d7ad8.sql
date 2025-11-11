-- Fix RLS policy so workspace members can see all other members in their workspace
DROP POLICY IF EXISTS "Users can view members of their workspaces" ON workspace_members;

CREATE POLICY "Users can view members of their workspaces"
ON workspace_members
FOR SELECT
USING (
  -- User can see all members of workspaces they belong to
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);