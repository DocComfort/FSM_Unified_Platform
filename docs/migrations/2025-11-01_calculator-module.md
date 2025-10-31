# Calculator Module Scaffold – Nov 1, 2025

- Added new package `@fsm/calculators` containing reusable HVAC calculator logic starting with the airflow/static pressure predictor (ported from BOLT FSM).
- Functions expose pure TypeScript utilities for reuse across web and mobile applications.
- Future work: migrate remaining calculator formulas (Manual J, duct sizing, filter sizing, etc.) and pair them with shared UI components.