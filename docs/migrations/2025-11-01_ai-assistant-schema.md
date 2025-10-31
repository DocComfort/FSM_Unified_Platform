# AI Assistant Schema – Nov 1, 2025

- Added `ai_assistants`, `ai_sessions`, `ai_messages`, `ai_documents`, `ai_document_chunks`, and `ai_tasks` tables.
- Introduced RLS policies to restrict write access to admins/managers and enforce session ownership for conversations.
- Stored document embeddings as `double precision[]` for compatibility; ready for future pgvector rollout.
- Regenerated Supabase TypeScript definitions to expose the new tables.

Next steps: wire Genkit/Anthropic flows to store messages and tasks, add seed data or migrations for initial assistant profiles, and document required AI provider environment variables in `/docs`.