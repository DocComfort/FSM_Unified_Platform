-- Create business_metrics table for KPI tracking and performance monitoring
-- This table stores daily business metrics calculated from operational data

DROP TABLE IF EXISTS public.business_metrics CASCADE;

CREATE TABLE IF NOT EXISTS public.business_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date date NOT NULL UNIQUE,
  
  -- Revenue metrics
  total_revenue numeric(10, 2) DEFAULT 0,
  average_ticket_size numeric(10, 2) DEFAULT 0,
  gross_profit_margin numeric(5, 2) DEFAULT 0,
  outstanding_invoices numeric(10, 2) DEFAULT 0,
  
  -- Job metrics
  jobs_completed integer DEFAULT 0,
  jobs_scheduled integer DEFAULT 0,
  
  -- Customer metrics
  new_customers integer DEFAULT 0,
  active_customers integer DEFAULT 0,
  customer_satisfaction_score numeric(3, 2) DEFAULT 0,
  
  -- Operations metrics
  technician_utilization numeric(5, 2) DEFAULT 0,
  inventory_value numeric(10, 2) DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_date CHECK (metric_date <= CURRENT_DATE),
  CONSTRAINT valid_satisfaction CHECK (customer_satisfaction_score >= 0 AND customer_satisfaction_score <= 5),
  CONSTRAINT valid_utilization CHECK (technician_utilization >= 0 AND technician_utilization <= 100),
  CONSTRAINT valid_margin CHECK (gross_profit_margin >= -100 AND gross_profit_margin <= 100)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_metrics_date ON public.business_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_business_metrics_revenue ON public.business_metrics(total_revenue);
CREATE INDEX IF NOT EXISTS idx_business_metrics_created ON public.business_metrics(created_at);

-- Enable Row Level Security
ALTER TABLE public.business_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Allow authenticated users to read all metrics
CREATE POLICY "Anyone can view business metrics"
  ON public.business_metrics
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins and managers can insert/update metrics
CREATE POLICY "Admins and managers can manage business metrics"
  ON public.business_metrics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_business_metrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at (using CREATE OR REPLACE would be ideal, but CREATE TRIGGER doesn't support it)
-- If the trigger already exists, this will fail safely - you can ignore that error
CREATE TRIGGER update_business_metrics_updated_at
  BEFORE UPDATE ON public.business_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_business_metrics_updated_at();

-- Insert sample metrics for the last 30 days
DO $$
DECLARE
  day_offset integer;
  target_date date;
BEGIN
  FOR day_offset IN 0..29 LOOP
    target_date := CURRENT_DATE - day_offset;
    
    INSERT INTO public.business_metrics (
      metric_date,
      total_revenue,
      jobs_completed,
      jobs_scheduled,
      new_customers,
      active_customers,
      average_ticket_size,
      customer_satisfaction_score,
      technician_utilization,
      inventory_value,
      outstanding_invoices,
      gross_profit_margin
    ) VALUES (
      target_date,
      (random() * 5000 + 2000)::numeric(10, 2), -- $2000-$7000 daily revenue
      (random() * 10 + 5)::integer, -- 5-15 jobs completed
      (random() * 15 + 10)::integer, -- 10-25 jobs scheduled
      (random() * 3)::integer, -- 0-3 new customers
      (random() * 50 + 30)::integer, -- 30-80 active customers
      (random() * 300 + 200)::numeric(10, 2), -- $200-$500 average ticket
      (random() * 1 + 4)::numeric(3, 2), -- 4.0-5.0 satisfaction score
      (random() * 20 + 70)::numeric(5, 2), -- 70-90% utilization
      (random() * 10000 + 5000)::numeric(10, 2), -- $5000-$15000 inventory
      (random() * 2000 + 500)::numeric(10, 2), -- $500-$2500 outstanding
      (random() * 15 + 25)::numeric(5, 2) -- 25-40% gross margin
    )
    ON CONFLICT (metric_date) DO NOTHING;
  END LOOP;
END $$;

-- Grant permissions
GRANT SELECT ON public.business_metrics TO authenticated;
GRANT ALL ON public.business_metrics TO service_role;

-- Add comment
COMMENT ON TABLE public.business_metrics IS 'Stores daily business metrics for KPI tracking and performance analysis. Updated daily by the business intelligence system.';
