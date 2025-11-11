-- Fix invitations UPDATE permissions and remove dependency on auth.users
DROP POLICY IF EXISTS "Recipients can update invitations" ON invitations;

-- Allow recipients to update their own invitations using get_user_email()
CREATE POLICY "Recipients can update invitations"
ON invitations
FOR UPDATE
USING (
  to_email = get_user_email(auth.uid())
);

-- Allow workspace owners to manage invitations in their workspace (e.g., revoke/decline on member removal)
CREATE POLICY "Owners can update invitations in their workspace"
ON invitations
FOR UPDATE
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
);