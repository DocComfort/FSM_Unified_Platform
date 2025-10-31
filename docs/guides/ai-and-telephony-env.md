# AI & Telephony Environment Configuration

## Supabase Secret Keys
Configure these secrets for edge functions and server-side flows (use `supabase secrets set KEY=VALUE`):

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_MESSAGE_SERVICE_SID`
- `ANTHROPIC_API_KEY` (Claude)
- `GOOGLE_VERTEX_PROJECT_ID`, `GOOGLE_VERTEX_REGION`, `GOOGLE_APPLICATION_CREDENTIALS`
- `OPENAI_API_KEY` (optional fallback)
- `AI_DEFAULT_ASSISTANT_ID` (once seeded)

## Web / Mobile Environment Variables
Update `.env` and `apps/mobile/.env` with:

```
VITE_TWILIO_VOICE_FUNCTION_URL=
VITE_TWILIO_STATUS_FUNCTION_URL=
VITE_AI_ASSISTANT_ID=
VITE_AI_PROVIDER=anthropic
VITE_AI_MODEL=claude-3-5-sonnet
```

The Expo app mirrors these keys using the `EXPO_PUBLIC_` prefix.

## Data Seeding
- Populate `ai_assistants` with at least one assistant configuration (name, provider, model).
- Upload knowledge documents via `ai_documents` and `ai_document_chunks` to ground responses.
- Use `ai_tasks` to queue embedding generation or asynchronous jobs.

Document reference migrations:
- `202511020001_add_twilio_call_tracking.sql`
- `202511020002_add_ai_assistant_schema.sql`