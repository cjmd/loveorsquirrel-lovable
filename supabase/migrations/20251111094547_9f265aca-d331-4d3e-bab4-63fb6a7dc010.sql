-- Create security definer function to check if user has a pending invitation
CREATE OR REPLACE FUNCTION public.has_pending_invitation(_user_id uuid, _workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM invitations
    WHERE workspace_id = _workspace_id
      AND to_email = get_user_email(_user_id)
      AND status = 'pending'
  )
$$;

-- Drop and recreate the INSERT policy for workspace_members
DROP POLICY IF EXISTS "Workspace owners can add members" ON workspace_members;

CREATE POLICY "Workspace owners can add members"
ON workspace_members
FOR INSERT
WITH CHECK (
  -- Allow workspace owners to add members
  is_workspace_owner(auth.uid(), workspace_id) 
  OR 
  -- Allow users with pending invitations to add themselves
  (user_id = auth.uid() AND has_pending_invitation(auth.uid(), workspace_id))
);