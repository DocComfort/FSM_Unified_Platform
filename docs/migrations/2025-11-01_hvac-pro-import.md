# HVAC Pro Schema Import – Nov 1, 2025

The following legacy migrations from `HVAC_Pro_Field_Service_Management_1` were ported into the unified Supabase project and renamed to maintain forward-only sequencing:

- 202511010001_clean_schema.sql
- 202511010002_add_pricing_tables.sql
- 202511010003_create_company_settings.sql
- 202511010004_add_customer_vendor_name_fields.sql
- 202511010005_fix_company_settings_policies.sql
- 202511010006_fix_integration_settings_policies.sql
- 202511010007_update_company_address_structure.sql
- 202511010008_add_google_workspace_api_keys.sql
- 202511010009_phase2_critical_tables.sql
- 202511010010_phase3_extended_features.sql
- 202511010011_phase4_advanced_features.sql
- 202511010012_phase5_integrations_misc.sql
- 202511010013_add_employee_enhanced_fields.sql
- 202511010014_add_customer_notes_documents.sql
- 202511010015_fix_jobs_assigned_technician.sql
- 202511010016_add_customer_type_column.sql
- 202511010017_fix_schema_mismatches.sql
- 202511010018_add_photo_tables.sql
- 202511010019_add_accounting_role.sql
- 202511010020_employee_portal_features.sql
- 202511010021_fix_customers_for_seeding.sql
- 202511010022_add_business_metrics_table.sql (updated to rebuild table before creating indexes)
- 202511010023_add_invite_employee_function.sql
- 202511010024_add_purchase_orders_only.sql (policies wrapped with `DROP POLICY IF EXISTS`)
- 202511010025_insert_sample_business_metrics.sql

Adjustments:
- `business_metrics` table is recreated to new KPI structure before seeding sample data.
- Purchase order policies drop existing definitions before recreation to avoid conflicts.

Next steps:
- Merge Docs-Fantastic AI/Twilio migrations.
- Integrate BOLT calculator reference data.
- Add FSM-Mobile offline sync artifacts.