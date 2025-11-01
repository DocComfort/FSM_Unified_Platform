# AI Audit & Collaboration Tables - Nov 2, 2025

- Imported Docs-Fantastic collaboration assets into Supabase: `ai_session_participants` enables multi-user conversations with RLS honoring owners/collaborators.
- Added `ai_message_feedback` for qualitative ratings and coaching notes on assistant responses.
- Logged tool invocations via `ai_tool_invocations`, capturing function-calling payloads, status, and errors for Anthropic/Vertex automations.
- Introduced `ai_usage_events` telemetry for token accounting, costs, and model health dashboards.
- New enums `ai_participant_role` and `ai_tool_status` created; Supabase types regenerated to expose the structures in `@fsm/types`.

Next steps: seed participant rows during session creation, forward tool invocation metrics from edge functions, and publish BI dashboards against `ai_usage_events`.
