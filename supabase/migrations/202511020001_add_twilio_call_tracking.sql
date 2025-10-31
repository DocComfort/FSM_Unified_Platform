-- Add Twilio call tracking columns to customer communications
-- This upgrade aligns legacy Docs-Fantastic call analytics with the unified schema

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'customer_communications'
      AND column_name = 'call_sid'
  ) THEN
    ALTER TABLE public.customer_communications ADD COLUMN call_sid text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'customer_communications'
      AND column_name = 'call_status'
  ) THEN
    ALTER TABLE public.customer_communications ADD COLUMN call_status text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'customer_communications'
      AND column_name = 'call_duration'
  ) THEN
    ALTER TABLE public.customer_communications ADD COLUMN call_duration integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'customer_communications'
      AND column_name = 'call_recording_url'
  ) THEN
    ALTER TABLE public.customer_communications ADD COLUMN call_recording_url text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_customer_comms_call_sid ON public.customer_communications(call_sid);
CREATE INDEX IF NOT EXISTS idx_customer_comms_call_status ON public.customer_communications(call_status);