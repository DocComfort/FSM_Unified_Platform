-- Migration: Add Enhanced Employee Fields
-- Date: 2025-10-07
-- Description: Add address, birthdate, driver's license, benefits, and significant dates to employees table

-- Add phone extension and full_name to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone_extension VARCHAR(10),
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Add new columns to employees table
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS street_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS street_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS apt_suite VARCHAR(50),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(2),
ADD COLUMN IF NOT EXISTS zipcode VARCHAR(10),
ADD COLUMN IF NOT EXISTS birthdate DATE,
ADD COLUMN IF NOT EXISTS drivers_license_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS significant_dates JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb;

-- Create index on zipcode for potential location-based queries
CREATE INDEX IF NOT EXISTS idx_employees_zipcode ON employees(zipcode);

-- Create index on birthdate for birthday reports
CREATE INDEX IF NOT EXISTS idx_employees_birthdate ON employees(birthdate);

-- Add comments for documentation
COMMENT ON COLUMN employees.street_number IS 'Street number of employee address';
COMMENT ON COLUMN employees.street_name IS 'Street name of employee address';
COMMENT ON COLUMN employees.apt_suite IS 'Apartment or suite number';
COMMENT ON COLUMN employees.city IS 'City of employee address';
COMMENT ON COLUMN employees.state IS 'Two-letter state code';
COMMENT ON COLUMN employees.zipcode IS 'Postal zip code';
COMMENT ON COLUMN employees.birthdate IS 'Employee date of birth';
COMMENT ON COLUMN employees.drivers_license_number IS 'Driver license number';
COMMENT ON COLUMN employees.significant_dates IS 'Array of {date, description} objects for anniversaries, etc.';
COMMENT ON COLUMN employees.benefits IS 'Array of {type, enabled, details} for employee benefits';
COMMENT ON COLUMN profiles.phone_extension IS 'Phone extension number';
COMMENT ON COLUMN profiles.full_name IS 'Full name - defaults to first + last but can be customized';

-- Update certifications column to match new structure (if needed)
-- Note: certifications is already JSONB, but we'll add a comment for the new structure
COMMENT ON COLUMN employees.certifications IS 'Array of {certification_number, description, issuer, issue_date, expiry_date, status}';

-- Sample data structure for significant_dates:
-- [
--   {"id": "uuid", "date": "2020-05-15", "description": "Anniversary"},
--   {"id": "uuid", "date": "2022-08-20", "description": "Promotion Date"}
-- ]

-- Sample data structure for benefits:
-- [
--   {"type": "health", "enabled": true, "details": "Blue Cross PPO"},
--   {"type": "vision", "enabled": true, "details": "VSP"},
--   {"type": "vacation", "enabled": true, "details": "15 days/year"},
--   {"type": "pto", "enabled": true, "details": "5 days/year"},
--   {"type": "tool_reimbursement", "enabled": true, "details": "$500/year"},
--   {"type": "hearing", "enabled": false, "details": null}
-- ]
