-- Allow workspace members to view each other's profiles (email and name only)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

CREATE POLICY "Users can view profiles in their workspace"
ON profiles
FOR SELECT
USING (
  -- Users can view their own profile
  auth.uid() = id
  OR
  -- Users can view profiles of people in their workspace
  id IN (
    SELECT wm.user_id
    FROM workspace_members wm
    WHERE wm.workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  )
);