-- Migration: Update company_settings address structure
-- Purpose: Replace single address field with structured address fields
-- Author: System
-- Date: 2025-10-11

-- ============================================
-- ADD STRUCTURED ADDRESS FIELDS
-- ============================================

-- Add new address fields
ALTER TABLE company_settings 
ADD COLUMN IF NOT EXISTS street_number TEXT,
ADD COLUMN IF NOT EXISTS street_name TEXT,
ADD COLUMN IF NOT EXISTS apt_suite TEXT;

-- Rename existing columns to match standard structure
ALTER TABLE company_settings 
RENAME COLUMN address TO street_number_old;

-- Note: We keep the old column temporarily for data migration
-- The old 'address' field is renamed to 'street_number_old'
-- This allows manual data migration if needed

-- ============================================
-- UPDATE DEFAULT ROW
-- ============================================

-- Ensure default row has proper structure
UPDATE company_settings
SET 
  street_number = NULL,
  street_name = NULL,
  apt_suite = NULL
WHERE id = 1 AND street_number IS NULL;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON COLUMN company_settings.street_number IS 'Street number (e.g., "123")';
COMMENT ON COLUMN company_settings.street_name IS 'Street name (e.g., "Main Street")';
COMMENT ON COLUMN company_settings.apt_suite IS 'Apartment or Suite number (optional)';
COMMENT ON COLUMN company_settings.city IS 'City name';
COMMENT ON COLUMN company_settings.state IS 'State abbreviation (e.g., "TX")';
COMMENT ON COLUMN company_settings.zipcode IS 'ZIP or postal code';
COMMENT ON COLUMN company_settings.street_number_old IS 'DEPRECATED: Old single-line address field. Will be removed in future migration.';

-- ============================================
-- NOTES
-- ============================================
-- This migration updates company_settings to use structured address fields
-- matching the pattern used in customers, employees, and other forms:
-- - street_number: "#" (house/building number)
-- - street_name: "Street Name"
-- - apt_suite: "Unit/Apt/Suite" (optional)
-- - city: "City"
-- - state: "State" (2-letter abbreviation)
-- - zipcode: "ZIP Code"
--
-- Benefits:
-- 1. Consistency across all address fields in the system
-- 2. Better geocoding accuracy for Google Maps
-- 3. Easier address validation and formatting
-- 4. Matches customer/vendor/employee address structure
--
-- Migration Path:
-- 1. Old 'address' field renamed to 'street_number_old' (preserved for reference)
-- 2. New structured fields added (street_number, street_name, apt_suite)
-- 3. City, state, zipcode fields already exist
-- 4. Manually migrate data from street_number_old to new fields via Settings UI
-- 5. In future migration, drop street_number_old column
