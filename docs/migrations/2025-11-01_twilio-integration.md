# Twilio Voice Integration – Nov 1, 2025

- Added `customer_communications` call tracking columns (`call_sid`, `call_status`, `call_duration`, `call_recording_url`).
- Ported Twilio voice Supabase Edge Functions:
  - `supabase/functions/twilio-voice` for call initiation TwiML.
  - `supabase/functions/twilio-call-status` for call status webhooks, updating communications records.
- Regenerated Supabase TypeScript types to expose new columns.

Next steps: configure Twilio credentials in Supabase project environment variables and update application flows to create communication records with `call_sid` during call initialization.