-- Migration: Create company_settings table
-- Purpose: Store company profile information separate from integration_settings
-- Author: System
-- Date: 2025-10-07

-- ============================================
-- COMPANY SETTINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS company_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    company_name TEXT NOT NULL DEFAULT 'HVAC Pro Service',
    email TEXT,
    phone TEXT,
    license_number TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zipcode TEXT,
    website TEXT,
    logo_url TEXT,
    timezone TEXT DEFAULT 'America/New_York',
    currency TEXT DEFAULT 'USD',
    date_format TEXT DEFAULT 'MM/DD/YYYY',
    time_format TEXT DEFAULT '12h',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default row
INSERT INTO company_settings (id, company_name)
VALUES (1, 'HVAC Pro Service')
ON CONFLICT (id) DO NOTHING;

-- Add comment
COMMENT ON TABLE company_settings IS 'Stores company profile information - single row table (id always = 1)';

-- ============================================
-- INDEXES & CONSTRAINTS
-- ============================================

-- Add index on updated_at for tracking changes
CREATE INDEX IF NOT EXISTS idx_company_settings_updated_at ON company_settings(updated_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read company settings
DROP POLICY IF EXISTS "Allow authenticated users to read company settings" ON company_settings;
CREATE POLICY "Allow authenticated users to read company settings"
ON company_settings
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only admins can update company settings
DROP POLICY IF EXISTS "Only admins can update company settings" ON company_settings;
CREATE POLICY "Only admins can update company settings"
ON company_settings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ============================================
-- TRIGGER FOR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_company_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER company_settings_updated_at
    BEFORE UPDATE ON company_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_company_settings_updated_at();

-- ============================================
-- NOTES
-- ============================================
-- This is a single-row table (id always = 1)
-- Use UPSERT pattern: INSERT ... ON CONFLICT (id) DO UPDATE
-- Only users with 'admin' role can modify settings
