-- Calculator history storage for cross-platform persistence

CREATE TABLE IF NOT EXISTS public.calculator_run_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calculator_type text NOT NULL CHECK (calculator_type IN ('airflow', 'duct', 'filter', 'manual_j')),
  input_payload jsonb NOT NULL,
  result_payload jsonb,
  notes text,
  platform text DEFAULT 'web',
  device_id uuid,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_calculator_history_profile ON public.calculator_run_history(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calculator_history_type ON public.calculator_run_history(calculator_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calculator_history_device ON public.calculator_run_history(device_id, created_at DESC);

ALTER TABLE public.calculator_run_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Calculator history readable" ON public.calculator_run_history;
CREATE POLICY "Calculator history readable" ON public.calculator_run_history
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Calculator history insert" ON public.calculator_run_history;
CREATE POLICY "Calculator history insert" ON public.calculator_run_history
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Calculator history service access" ON public.calculator_run_history;
CREATE POLICY "Calculator history service access" ON public.calculator_run_history
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.calculator_run_history IS 'Technician calculator runs logged from web/mobile clients.';
