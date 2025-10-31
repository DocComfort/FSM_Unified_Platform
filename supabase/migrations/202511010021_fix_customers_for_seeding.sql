-- Migration: Fix customers table to use mobile instead of secondary_phone
-- Purpose: Update customers table structure for seed data compatibility  
-- Date: 2025-10-20

-- Add mobile column to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS mobile TEXT;

-- If secondary_phone exists, migrate data to mobile column
UPDATE customers 
SET mobile = secondary_phone 
WHERE secondary_phone IS NOT NULL AND mobile IS NULL;

-- Drop secondary_phone column if it exists (optional, for cleanup)
-- ALTER TABLE customers DROP COLUMN IF EXISTS secondary_phone;

-- Update customers table to ensure all required fields exist for seeding
ALTER TABLE customers 
  ADD COLUMN IF NOT EXISTS customer_type VARCHAR(50) DEFAULT 'residential',
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city VARCHAR(100), 
  ADD COLUMN IF NOT EXISTS state VARCHAR(10),
  ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'direct';

-- Ensure customer_number has a default generator for seeding
CREATE OR REPLACE FUNCTION generate_customer_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        new_number := 'CUST-' || LPAD(counter::TEXT, 5, '0');
        
        -- Check if this number already exists
        IF NOT EXISTS (SELECT 1 FROM customers WHERE customer_number = new_number) THEN
            RETURN new_number;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update customers table to use auto-generated customer numbers if null
UPDATE customers 
SET customer_number = generate_customer_number()
WHERE customer_number IS NULL OR customer_number = '';

-- Ensure contact_name is populated from first_name/last_name if missing
UPDATE customers 
SET contact_name = TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))
WHERE contact_name IS NULL OR contact_name = '';