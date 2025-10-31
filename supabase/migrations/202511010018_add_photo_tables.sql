-- =====================================================
-- Add Photo Management Tables
-- Migration: 20251016000000
-- Description: Creates tables for equipment photos and job photos
-- =====================================================

-- Create equipment_photos table
CREATE TABLE IF NOT EXISTS equipment_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  caption TEXT,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  CONSTRAINT fk_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES profiles(id)
);

-- Create job_photos table
CREATE TABLE IF NOT EXISTS job_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  caption TEXT,
  photo_type TEXT DEFAULT 'general', -- 'before', 'after', 'during', 'general'
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  CONSTRAINT fk_uploaded_by_job FOREIGN KEY (uploaded_by) REFERENCES profiles(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_equipment_photos_equipment_id ON equipment_photos(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_photos_uploaded_at ON equipment_photos(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_photos_job_id ON job_photos(job_id);
CREATE INDEX IF NOT EXISTS idx_job_photos_customer_id ON job_photos(customer_id);
CREATE INDEX IF NOT EXISTS idx_job_photos_uploaded_at ON job_photos(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_photos_photo_type ON job_photos(photo_type);

-- Enable Row Level Security
ALTER TABLE equipment_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for equipment_photos
CREATE POLICY "Users can view equipment photos"
  ON equipment_photos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create equipment photos"
  ON equipment_photos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own equipment photos"
  ON equipment_photos FOR UPDATE
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete own equipment photos"
  ON equipment_photos FOR DELETE
  USING (uploaded_by = auth.uid());

-- RLS Policies for job_photos
CREATE POLICY "Users can view job photos"
  ON job_photos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create job photos"
  ON job_photos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own job photos"
  ON job_photos FOR UPDATE
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete own job photos"
  ON job_photos FOR DELETE
  USING (uploaded_by = auth.uid());

-- Create storage buckets (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('equipment-photos', 'equipment-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]),
  ('job-photos', 'job-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]),
  ('customer-documents', 'customer-documents', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']::text[])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for equipment-photos bucket
CREATE POLICY "Authenticated users can upload equipment photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'equipment-photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view equipment photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'equipment-photos');

CREATE POLICY "Users can update own equipment photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'equipment-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own equipment photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'equipment-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for job-photos bucket
CREATE POLICY "Authenticated users can upload job photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'job-photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view job photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'job-photos');

CREATE POLICY "Users can update own job photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'job-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own job photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'job-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for customer-documents bucket
CREATE POLICY "Authenticated users can upload customer documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'customer-documents' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view customer documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'customer-documents');

CREATE POLICY "Users can update own customer documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'customer-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own customer documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'customer-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Grant necessary permissions
GRANT ALL ON equipment_photos TO authenticated;
GRANT ALL ON job_photos TO authenticated;
GRANT SELECT ON equipment_photos TO anon;
GRANT SELECT ON job_photos TO anon;
