-- Migration: Create Customer Notes and Documents Tables
-- Date: 2025-10-13
-- Description: Add tables for customer notes and document storage

-- Create customer_notes table
CREATE TABLE IF NOT EXISTS customer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customer_documents table
CREATE TABLE IF NOT EXISTS customer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  category TEXT DEFAULT 'general',
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_notes_customer_id ON customer_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_notes_created_at ON customer_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_documents_customer_id ON customer_documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_documents_category ON customer_documents(category);
CREATE INDEX IF NOT EXISTS idx_customer_documents_uploaded_at ON customer_documents(uploaded_at DESC);

-- Enable RLS
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_notes
-- PLACEHOLDER policy removed

CREATE POLICY "Users can view customer notes"
  ON customer_notes FOR SELECT
  USING (auth.role() = 'authenticated');

-- PLACEHOLDER policy removed

CREATE POLICY "Users can create customer notes"
  ON customer_notes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- PLACEHOLDER policy removed

CREATE POLICY "Users can update own customer notes"
  ON customer_notes FOR UPDATE
  USING (created_by = auth.uid());

-- PLACEHOLDER policy removed

CREATE POLICY "Users can delete own customer notes"
  ON customer_notes FOR DELETE
  USING (created_by = auth.uid());

-- RLS Policies for customer_documents
-- PLACEHOLDER policy removed

CREATE POLICY "Users can view customer documents"
  ON customer_documents FOR SELECT
  USING (auth.role() = 'authenticated');

-- PLACEHOLDER policy removed

CREATE POLICY "Users can create customer documents"
  ON customer_documents FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- PLACEHOLDER policy removed

CREATE POLICY "Users can update own customer documents"
  ON customer_documents FOR UPDATE
  USING (uploaded_by = auth.uid());

-- PLACEHOLDER policy removed

CREATE POLICY "Users can delete own customer documents"
  ON customer_documents FOR DELETE
  USING (uploaded_by = auth.uid());

-- Create updated_at trigger for customer_notes
CREATE OR REPLACE FUNCTION update_customer_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_notes_updated_at
  BEFORE UPDATE ON customer_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_notes_updated_at();

-- Grant permissions
GRANT ALL ON customer_notes TO authenticated;
GRANT ALL ON customer_documents TO authenticated;
