-- Insert sample metrics for the last 30 days
-- Run this in Supabase SQL Editor to populate the table with test data

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
)
SELECT 
  (CURRENT_DATE - generate_series(0, 29))::date as metric_date,
  (random() * 5000 + 2000)::numeric(10, 2) as total_revenue,
  (random() * 10 + 5)::integer as jobs_completed,
  (random() * 15 + 10)::integer as jobs_scheduled,
  (random() * 3)::integer as new_customers,
  (random() * 50 + 30)::integer as active_customers,
  (random() * 300 + 200)::numeric(10, 2) as average_ticket_size,
  (random() * 1 + 4)::numeric(3, 2) as customer_satisfaction_score,
  (random() * 20 + 70)::numeric(5, 2) as technician_utilization,
  (random() * 10000 + 5000)::numeric(10, 2) as inventory_value,
  (random() * 2000 + 500)::numeric(10, 2) as outstanding_invoices,
  (random() * 15 + 25)::numeric(5, 2) as gross_profit_margin
FROM generate_series(0, 29)
ON CONFLICT (metric_date) DO NOTHING;
