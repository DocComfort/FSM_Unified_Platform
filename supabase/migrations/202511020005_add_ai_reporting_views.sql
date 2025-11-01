-- Reporting views for AI usage and tool monitoring

CREATE OR REPLACE VIEW public.ai_usage_daily_metrics AS
SELECT
  date_trunc('day', created_at) AS usage_date,
  provider,
  model,
  COALESCE(sum(total_tokens), 0) AS total_tokens,
  COALESCE(sum(cost_cents), 0) AS total_cost_cents,
  COUNT(*) AS invocation_count,
  COALESCE(avg(duration_ms), 0) AS avg_duration_ms
FROM public.ai_usage_events
GROUP BY usage_date, provider, model
ORDER BY usage_date DESC, provider, model;

CREATE OR REPLACE VIEW public.ai_tool_status_summary AS
SELECT
  tool_name,
  status,
  COUNT(*) AS invocation_count,
  COALESCE(sum((output ->> 'messages_processed')::integer), 0) AS messages_processed
FROM public.ai_tool_invocations
GROUP BY tool_name, status
ORDER BY tool_name, status;

COMMENT ON VIEW public.ai_usage_daily_metrics IS 'Aggregated daily token usage, cost, and performance per model.';
COMMENT ON VIEW public.ai_tool_status_summary IS 'Invocation counts and health status for registered AI tools.';
