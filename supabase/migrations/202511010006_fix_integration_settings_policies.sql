-- Migration: Fix integration_settings RLS policies
-- Purpose: Add missing INSERT policy for integration_settings table
-- Author: System
-- Date: 2025-10-11

-- ============================================
-- FIX INTEGRATION_SETTINGS POLICIES
-- ============================================

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "integration_settings_select" ON integration_settings;
DROP POLICY IF EXISTS "integration_settings_update" ON integration_settings;
DROP POLICY IF EXISTS "integration_settings_insert" ON integration_settings;

-- Policy: Allow admins and managers to read integration settings
-- PLACEHOLDER policy removed

CREATE POLICY "Allow admins and managers to read integration settings"
ON integration_settings
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'manager')
    )
);

-- Policy: Allow admins to insert integration settings
-- PLACEHOLDER policy removed

CREATE POLICY "Allow admins to insert integration settings"
ON integration_settings
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Policy: Allow admins to update integration settings
-- PLACEHOLDER policy removed

CREATE POLICY "Allow admins to update integration settings"
ON integration_settings
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
-- ENSURE DEFAULT ROW EXISTS
-- ============================================

-- Insert default row if it doesn't exist
INSERT INTO integration_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ADD TRIGGER FOR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_integration_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS integration_settings_updated_at ON integration_settings;

CREATE TRIGGER integration_settings_updated_at
    BEFORE UPDATE ON integration_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_integration_settings_updated_at();

-- ============================================
-- NOTES
-- ============================================
-- This migration fixes the 403 error when saving API keys
-- by adding the missing INSERT policy for integration_settings
-- Only admins can insert/update, admins and managers can read
