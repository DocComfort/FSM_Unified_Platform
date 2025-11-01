# Calculator History & AI Reporting - Nov 2, 2025

- Added `calculator_run_history` table with authenticated RLS policies to capture calculator runs from web and mobile clients.
- Seeded Ops Copilot assistant, default session, and sample telemetry records plus enabled new reporting views (`ai_usage_daily_metrics`, `ai_tool_status_summary`).
- Local runs sync to Supabase once a technician signs in; mobile/web clients fall back to device storage offline.
- Introduced pgTAP assertions (`supabase/tests/ai_policies.sql`) to guard the new policies.
- Views power dashboards for cost tracking, latency analysis, and tool failure monitoring.
