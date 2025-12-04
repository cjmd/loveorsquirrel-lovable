-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create their own workspace" ON public.workspaces;

-- Recreate as a permissive policy (default)
CREATE POLICY "Users can create their own workspace"
ON public.workspaces
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());