-- Create a security definer function to check if users share a workspace
CREATE OR REPLACE FUNCTION public.users_share_workspace(_user_id_1 uuid, _user_id_2 uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM workspace_members wm1
    JOIN workspace_members wm2 ON wm1.workspace_id = wm2.workspace_id
    WHERE wm1.user_id = _user_id_1
      AND wm2.user_id = _user_id_2
  )
$$;

-- Update profiles policy to use the security definer function
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON profiles;

CREATE POLICY "Users can view profiles in their workspace"
ON profiles
FOR SELECT
USING (
  auth.uid() = id
  OR
  users_share_workspace(auth.uid(), id)
);