-- Migration: Fix schema mismatches between frontend and database
-- Date: 2025-10-15
-- Purpose: Add missing columns and aliases for frontend compatibility

-- Add billing_same_as_service column to customers table
-- This is a convenience field to track if billing address matches service address
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS billing_same_as_service boolean DEFAULT true;

COMMENT ON COLUMN public.customers.billing_same_as_service IS 'Indicates if billing address is the same as service address';

-- Instead of creating a view, let's just add the column as an alias using a generated column
-- Note: PostgreSQL doesn't support true column aliases, so we'll update the frontend code instead
-- This migration just adds the billing_same_as_service column for now

-- Update existing customers to set billing_same_as_service based on whether billing_address exists
UPDATE public.customers
SET billing_same_as_service = (billing_address IS NULL OR billing_address = service_address)
WHERE billing_same_as_service IS NULL;
