DROP POLICY IF EXISTS "Authenticated view emergency requests" ON public.emergency_requests;
DROP POLICY IF EXISTS "Authenticated update emergency requests" ON public.emergency_requests;

CREATE POLICY "Users view own emergency requests"
  ON public.emergency_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own emergency requests"
  ON public.emergency_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);