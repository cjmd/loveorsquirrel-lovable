-- Create security definer function to get user's email
CREATE OR REPLACE FUNCTION public.get_user_email(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email::text FROM auth.users WHERE id = _user_id
$$;

-- Drop and recreate the RLS policy for viewing invitations
DROP POLICY IF EXISTS "Users can view invitations sent to them" ON invitations;

CREATE POLICY "Users can view invitations sent to them"
ON invitations
FOR SELECT
USING (
  to_email = get_user_email(auth.uid()) OR from_user_id = auth.uid()
);