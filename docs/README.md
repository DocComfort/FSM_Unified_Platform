# Documentation Index

This directory centralizes architecture decisions, migration guides, API references, and onboarding paths for the FSM Unified Platform.

## Suggested Structure

- `architecture/` – ADRs, diagrams, module ownership.
- `guides/` – Setup scripts, Supabase workflow instructions, deployment runbooks.
- `migrations/` – Schema merge notes, data normalization plans.
- `playbooks/` – Feature integration checklists, testing matrices, release cadences.

## Immediate TODOs

1. Draft an ADR detailing calculator history persistence (Supabase + device storage).
2. Document environment setup for contributors (Node, Expo, Supabase CLI, VS Code tasks).
3. Capture the rollout plan for AI reporting views and BI dashboards.
4. Extend testing standards to cover pgTAP execution (`supabase db test`) alongside Vitest/Jest suites.
