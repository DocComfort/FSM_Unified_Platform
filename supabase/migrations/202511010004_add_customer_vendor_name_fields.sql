-- Migration: Add first_name, last_name, and full_name fields to customers and vendors
-- Purpose: Enable structured name handling with auto-fill but allow manual override
-- Author: System
-- Date: 2025-10-08

-- ============================================
-- CUSTOMERS TABLE ENHANCEMENTS
-- ============================================

-- Add new name fields to customers table
ALTER TABLE customers 
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Migrate existing contact_name data to new fields
-- Try to split contact_name into first/last name
UPDATE customers
SET 
  first_name = CASE 
    WHEN contact_name LIKE '% %' THEN SPLIT_PART(contact_name, ' ', 1)
    ELSE contact_name
  END,
  last_name = CASE 
    WHEN contact_name LIKE '% %' THEN SUBSTRING(contact_name FROM POSITION(' ' IN contact_name) + 1)
    ELSE ''
  END,
  full_name = contact_name
WHERE first_name IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN customers.first_name IS 'First name of the contact person';
COMMENT ON COLUMN customers.last_name IS 'Last name of the contact person';
COMMENT ON COLUMN customers.full_name IS 'Full name of contact - auto-fills from first/last but can be manually edited';

-- ============================================
-- VENDORS TABLE ENHANCEMENTS
-- ============================================

-- Add new name fields to vendors table
ALTER TABLE vendors 
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Migrate existing contact_name data to new fields
UPDATE vendors
SET 
  first_name = CASE 
    WHEN contact_name LIKE '% %' THEN SPLIT_PART(contact_name, ' ', 1)
    ELSE contact_name
  END,
  last_name = CASE 
    WHEN contact_name LIKE '% %' THEN SUBSTRING(contact_name FROM POSITION(' ' IN contact_name) + 1)
    ELSE ''
  END,
  full_name = contact_name
WHERE first_name IS NULL AND contact_name IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN vendors.first_name IS 'First name of the vendor contact person';
COMMENT ON COLUMN vendors.last_name IS 'Last name of the vendor contact person';
COMMENT ON COLUMN vendors.full_name IS 'Full name of vendor contact - auto-fills from first/last but can be manually edited';

-- ============================================
-- NOTES
-- ============================================
-- 1. The contact_name field is retained for backward compatibility
-- 2. New records should use first_name, last_name, and full_name
-- 3. full_name should auto-populate from first_name + last_name but allow manual override
-- 4. This migration splits existing contact_name values on the first space
-- 5. Single-word names will go to first_name with empty last_name
