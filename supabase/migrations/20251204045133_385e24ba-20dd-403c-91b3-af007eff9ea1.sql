-- Create a secure function to create workspaces
CREATE OR REPLACE FUNCTION public.create_workspace(workspace_name text DEFAULT 'New Workspace')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_workspace_id uuid;
  current_user_id uuid;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Create the workspace
  INSERT INTO public.workspaces (owner_id, name)
  VALUES (current_user_id, workspace_name)
  RETURNING id INTO new_workspace_id;
  
  -- Add user as owner member
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, current_user_id, 'owner');
  
  RETURN new_workspace_id;
END;
$$;