-- Add completed_at column to track when tasks were archived
ALTER TABLE public.tasks 
ADD COLUMN completed_at timestamp with time zone;

-- Backfill completed_at for existing completed tasks using updated_at
UPDATE public.tasks 
SET completed_at = updated_at 
WHERE completed = true AND completed_at IS NULL;

-- Create trigger to set completed_at when task is completed
CREATE OR REPLACE FUNCTION public.handle_task_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- Set completed_at when task is marked as completed
  IF NEW.completed = true AND OLD.completed = false THEN
    NEW.completed_at = now();
  END IF;
  
  -- Clear completed_at when task is uncompleted
  IF NEW.completed = false AND OLD.completed = true THEN
    NEW.completed_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
DROP TRIGGER IF EXISTS on_task_completed ON public.tasks;
CREATE TRIGGER on_task_completed
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_task_completed();