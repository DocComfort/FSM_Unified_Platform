-- Migration: Ensure assigned_technician_id exists in jobs table
-- Date: 2025-10-13
-- Description: Add assigned_technician_id column if it doesn't exist

-- Add column if it doesn't exist
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS assigned_technician_id UUID REFERENCES profiles(id);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_technician 
ON jobs(assigned_technician_id);

-- Grant permissions
GRANT ALL ON jobs TO authenticated;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
