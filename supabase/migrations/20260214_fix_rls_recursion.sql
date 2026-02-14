-- Create a security definer function to check if the current user is an admin
-- This bypasses RLS to avoid infinite recursion when querying the users table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- Drop the recursive policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can update feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;

-- Re-create policies using the secure function
CREATE POLICY "Admins can view all users" 
  ON public.users FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can update all users" 
  ON public.users FOR UPDATE 
  USING (public.is_admin());

CREATE POLICY "Admins can view all transactions" 
  ON public.transactions FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can view all feedback" 
  ON public.feedback FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can update feedback" 
  ON public.feedback FOR UPDATE 
  USING (public.is_admin());

CREATE POLICY "Admins can manage settings" 
  ON public.settings FOR ALL 
  USING (public.is_admin());
