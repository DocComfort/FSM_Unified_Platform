-- Migration: Fix company_settings RLS policies
-- Purpose: Add missing INSERT policy for company_settings table
-- Author: System
-- Date: 2025-10-11

-- ============================================
-- FIX COMPANY_SETTINGS POLICIES
-- ============================================

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Allow authenticated users to read company settings" ON company_settings;
DROP POLICY IF EXISTS "Only admins can update company settings" ON company_settings;
DROP POLICY IF EXISTS "Allow admins to insert company settings" ON company_settings;

-- Policy: Allow authenticated users to read company settings
-- PLACEHOLDER policy removed

CREATE POLICY "Allow authenticated users to read company settings"
ON company_settings
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow admins to insert company settings (needed for upsert)
-- PLACEHOLDER policy removed

CREATE POLICY "Allow admins to insert company settings"
ON company_settings
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Policy: Allow admins to update company settings
-- PLACEHOLDER policy removed

CREATE POLICY "Allow admins to update company settings"
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
-- ENSURE DEFAULT ROW EXISTS
-- ============================================

-- Insert default row if it doesn't exist
INSERT INTO company_settings (id, company_name)
VALUES (1, 'HVAC Pro Service')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- NOTES
-- ============================================
-- This migration fixes the 403 error when saving company settings
-- by adding the missing INSERT policy for company_settings
-- Only admins can insert/update, all authenticated users can read
