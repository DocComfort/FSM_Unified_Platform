# ADR 0001: Supabase Schema Convergence

## Status

Proposed

## Context

Legacy codebases maintain divergent schemas for customers, service orders, equipment, and AI tooling. A unified schema is required to support cross-platform parity, offline sync, and advanced analytics.

## Decision

- Adopt HVAC Pro schema as baseline for core tables (customers, jobs/service_orders, invoices).
- Merge Docs-Fantastic AI tables for communication logs, AI task queue, and knowledge base references.
- Normalize BOLT calculator reference data into a dedicated `calculator_reference` schema.
- Generate TypeScript types via `supabase gen types typescript --linked` and publish to `@fsm/types`.
- Enforce RLS policies aligned with roles: `admin`, `manager`, `technician`, `dispatcher`.

## Consequences

- Requires a migration playbook to map existing data from remote Supabase instances.
- Demands CI coverage (pgTAP) for all policies + views.
- Downstream clients must adopt the new types, requiring refactors in both web and mobile apps.
