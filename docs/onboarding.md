# Developer Onboarding Checklist

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase CLI (`npm install -g supabase`)
- Expo CLI (`npx expo --version`)
- VS Code + recommended extensions (ESLint, Tailwind CSS IntelliSense, React Native Tools)

## First Day Flow

1. Clone `FSM_Unified_Platform` and run `npm install`.
2. Copy `.env.example` to `.env` and populate Supabase keys.
3. Start Supabase locally (`supabase start`) and apply migrations (`supabase db push`).
4. Launch web client: `npm run dev -- --filter=@fsm/web`.
5. Launch mobile client: `npm run dev -- --filter=@fsm/mobile` (scan QR with Expo Go).

## Knowledge Base

- `docs/architecture/` – ADRs, diagrams, high-level architecture.
- `docs/guides/` – Operational runbooks and feature-specific instructions.
- `docs/migrations/` – Schema change logs and data import steps.
- `docs/playbooks/` – QA processes and release cadences.

## Slack / Collaboration

- #fsm-platform – product planning + roadmap
- #fsm-engineering – implementation and code review threads
- #fsm-support – incident response and bug triage
