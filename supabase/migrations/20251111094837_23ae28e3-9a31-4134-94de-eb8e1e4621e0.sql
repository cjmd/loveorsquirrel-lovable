-- Replace get_user_email to avoid querying auth.users
CREATE OR REPLACE FUNCTION public.get_user_email(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email::text FROM public.profiles WHERE id = _user_id
$$;