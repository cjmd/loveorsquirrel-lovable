-- Create a security definer function to check workspace membership
CREATE OR REPLACE FUNCTION public.is_workspace_member(_workspace_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM workspace_members
    WHERE workspace_id = _workspace_id
      AND user_id = _user_id
  )
$$;

-- Drop and recreate all tasks policies to use the function
DROP POLICY IF EXISTS "Users can create workspace tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete workspace tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update workspace tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view workspace tasks" ON tasks;

-- Recreate policies using the security definer function
CREATE POLICY "Users can create workspace tasks"
ON tasks
FOR INSERT
WITH CHECK (
  user_id = auth.uid() 
  AND (
    workspace_id IS NULL 
    OR public.is_workspace_member(workspace_id, auth.uid())
  )
);

CREATE POLICY "Users can delete workspace tasks"
ON tasks
FOR DELETE
USING (
  user_id = auth.uid() 
  OR public.is_workspace_member(workspace_id, auth.uid())
);

CREATE POLICY "Users can update workspace tasks"
ON tasks
FOR UPDATE
USING (
  user_id = auth.uid() 
  OR public.is_workspace_member(workspace_id, auth.uid())
);

CREATE POLICY "Users can view workspace tasks"
ON tasks
FOR SELECT
USING (
  user_id = auth.uid() 
  OR public.is_workspace_member(workspace_id, auth.uid())
);