-- =====================================================
-- HVAC FSM Platform - Complete Database Schema
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'dispatcher', 'technician', 'sales', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('draft', 'scheduled', 'dispatched', 'in_progress', 'completed', 'cancelled', 'on_hold');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_priority AS ENUM ('low', 'medium', 'high', 'emergency');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- Core Tables
-- =====================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role DEFAULT 'technician',
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    status TEXT DEFAULT 'active',
    timezone TEXT DEFAULT 'America/New_York',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_number TEXT UNIQUE NOT NULL,
    company_name TEXT,
    contact_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    secondary_phone TEXT,
    billing_address JSONB,
    service_address JSONB,
    notes TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    assigned_technician_id UUID REFERENCES profiles(id),
    job_type TEXT NOT NULL,
    description TEXT,
    status job_status DEFAULT 'draft',
    priority job_priority DEFAULT 'medium',
    scheduled_date DATE,
    scheduled_start TIME,
    scheduled_end TIME,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    estimated_duration INTEGER, -- in minutes
    service_address JSONB,
    equipment_ids UUID[],
    parts_used JSONB,
    labor_hours DECIMAL,
    notes TEXT,
    photos TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estimates table
CREATE TABLE IF NOT EXISTS estimates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    estimate_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id),
    estimate_date DATE DEFAULT CURRENT_DATE,
    expiration_date DATE,
    status TEXT DEFAULT 'draft',
    line_items JSONB DEFAULT '[]',
    subtotal DECIMAL(10,2) DEFAULT 0,
    tax_rate DECIMAL(5,4) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    terms TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id),
    estimate_id UUID REFERENCES estimates(id),
    invoice_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    status TEXT DEFAULT 'draft',
    line_items JSONB DEFAULT '[]',
    subtotal DECIMAL(10,2) DEFAULT 0,
    tax_rate DECIMAL(5,4) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) DEFAULT 0,
    payment_terms TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address JSONB,
    website TEXT,
    account_number TEXT,
    payment_terms TEXT DEFAULT 'net_30',
    tax_id TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    equipment_type TEXT NOT NULL,
    manufacturer TEXT,
    model_number TEXT,
    serial_number TEXT UNIQUE,
    install_date DATE,
    warranty_expiry DATE,
    location TEXT,
    notes TEXT,
    maintenance_schedule JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    entity_type TEXT NOT NULL, -- 'customer', 'job', 'estimate', etc.
    entity_id UUID,
    uploaded_by UUID REFERENCES profiles(id),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communications tables
CREATE TABLE IF NOT EXISTS sms_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    phone_number TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'sent',
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT DEFAULT 'sent',
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    opened_at TIMESTAMPTZ,
    attachments JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GPS Tracking table
CREATE TABLE IF NOT EXISTS technician_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES profiles(id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL,
    speed DECIMAL,
    heading DECIMAL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    battery_level INTEGER,
    is_moving BOOLEAN DEFAULT false
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_jobs_customer ON jobs(customer_id);
-- Index on assigned_technician_id - only create if column exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'assigned_technician_id'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_jobs_technician ON jobs(assigned_technician_id);
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_jobs_date ON jobs(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_estimates_customer ON estimates(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_equipment_customer ON equipment(customer_id);
CREATE INDEX IF NOT EXISTS idx_files_entity ON files(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_technician_locations_employee ON technician_locations(employee_id);
CREATE INDEX IF NOT EXISTS idx_technician_locations_timestamp ON technician_locations(timestamp);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_locations ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (Allow authenticated users to read/write for now)
-- Drop existing policies if they exist, then recreate
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users" ON profiles;
    CREATE POLICY "Allow authenticated users" ON profiles FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Allow authenticated users" ON customers;
    CREATE POLICY "Allow authenticated users" ON customers FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Allow authenticated users" ON jobs;
    CREATE POLICY "Allow authenticated users" ON jobs FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Allow authenticated users" ON estimates;
    CREATE POLICY "Allow authenticated users" ON estimates FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Allow authenticated users" ON invoices;
    CREATE POLICY "Allow authenticated users" ON invoices FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Allow authenticated users" ON vendors;
    CREATE POLICY "Allow authenticated users" ON vendors FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Allow authenticated users" ON equipment;
    CREATE POLICY "Allow authenticated users" ON equipment FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Allow authenticated users" ON files;
    CREATE POLICY "Allow authenticated users" ON files FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Allow authenticated users" ON sms_messages;
    CREATE POLICY "Allow authenticated users" ON sms_messages FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Allow authenticated users" ON email_logs;
    CREATE POLICY "Allow authenticated users" ON email_logs FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Allow authenticated users" ON technician_locations;
    CREATE POLICY "Allow authenticated users" ON technician_locations FOR ALL TO authenticated USING (true);
END $$;

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_estimates_updated_at BEFORE UPDATE ON estimates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to generate sequential numbers
CREATE OR REPLACE FUNCTION generate_customer_number()
RETURNS TEXT AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(customer_number FROM 5) AS INTEGER)), 0) + 1
    INTO next_num
    FROM customers
    WHERE customer_number ~ '^CUST[0-9]+$';
    
    RETURN 'CUST' || LPAD(next_num::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_job_number()
RETURNS TEXT AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(job_number FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM jobs
    WHERE job_number ~ '^JOB[0-9]+$';
    
    RETURN 'JOB' || LPAD(next_num::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Auto-generate customer numbers
CREATE OR REPLACE FUNCTION set_customer_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.customer_number IS NULL OR NEW.customer_number = '' THEN
        NEW.customer_number = generate_customer_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_customer_number
    BEFORE INSERT ON customers
    FOR EACH ROW EXECUTE FUNCTION set_customer_number();

-- Auto-generate job numbers
CREATE OR REPLACE FUNCTION set_job_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.job_number IS NULL OR NEW.job_number = '' THEN
        NEW.job_number = generate_job_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_job_number
    BEFORE INSERT ON jobs
    FOR EACH ROW EXECUTE FUNCTION set_job_number();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '🎉 Database setup complete!';
    RAISE NOTICE '📊 Tables created: profiles, customers, jobs, estimates, invoices, vendors, equipment, files';
    RAISE NOTICE '🔒 Row Level Security enabled';
    RAISE NOTICE '🚀 Your HVAC Pro platform is ready to use!';
END
$$;