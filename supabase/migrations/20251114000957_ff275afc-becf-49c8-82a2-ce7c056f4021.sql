-- Add assigned_to column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Update RLS policies to allow assigned users to see their tasks
DROP POLICY IF EXISTS "Users can view workspace tasks" ON public.tasks;
CREATE POLICY "Users can view workspace tasks" 
ON public.tasks 
FOR SELECT 
USING (
  (user_id = auth.uid()) 
  OR is_workspace_member(workspace_id, auth.uid())
  OR (assigned_to = auth.uid())
);