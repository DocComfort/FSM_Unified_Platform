-- Add Google Workspace API key columns to integration_settings table
-- This migration adds support for Google Calendar, Gmail, and Google Drive API keys

-- Add new columns for Google Workspace services
ALTER TABLE integration_settings
ADD COLUMN IF NOT EXISTS google_calendar_api_key TEXT,
ADD COLUMN IF NOT EXISTS gmail_api_key TEXT,
ADD COLUMN IF NOT EXISTS google_drive_api_key TEXT;

-- Add comments for documentation
COMMENT ON COLUMN integration_settings.google_calendar_api_key IS 'Google Calendar API key for syncing appointments and technician schedules';
COMMENT ON COLUMN integration_settings.gmail_api_key IS 'Gmail API key for sending invoices, estimates, and customer communications';
COMMENT ON COLUMN integration_settings.google_drive_api_key IS 'Google Drive API key for storing and sharing job photos, documents, and reports';

-- Update the updated_at timestamp
UPDATE integration_settings SET updated_at = NOW() WHERE id = 1;
