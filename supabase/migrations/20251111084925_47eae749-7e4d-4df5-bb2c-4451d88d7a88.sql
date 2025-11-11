-- Create security definer function to check workspace ownership
CREATE OR REPLACE FUNCTION public.is_workspace_owner(_user_id uuid, _workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM workspaces
    WHERE id = _workspace_id
      AND owner_id = _user_id
  )
$$;

-- Drop existing policies on workspace_members
DROP POLICY IF EXISTS "Users can view members of their workspaces" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners can add members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners can remove members" ON workspace_members;

-- Recreate policies using the security definer function
CREATE POLICY "Users can view members of their workspaces"
ON workspace_members
FOR SELECT
USING (
  is_workspace_owner(auth.uid(), workspace_id) OR user_id = auth.uid()
);

CREATE POLICY "Workspace owners can add members"
ON workspace_members
FOR INSERT
WITH CHECK (
  is_workspace_owner(auth.uid(), workspace_id)
);

CREATE POLICY "Workspace owners can remove members"
ON workspace_members
FOR DELETE
USING (
  is_workspace_owner(auth.uid(), workspace_id)
);