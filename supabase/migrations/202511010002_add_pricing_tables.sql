-- =====================================================
-- Pricing & Services Module Tables
-- =====================================================

-- Pricing Rules Table
CREATE TABLE IF NOT EXISTS pricing_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_name TEXT NOT NULL,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('standard', 'time_and_material', 'flat_rate', 'tiered')),
    applies_to TEXT DEFAULT 'all',
    overhead_percentage DECIMAL(5,2) DEFAULT 15.00,
    benefits_percentage DECIMAL(5,2) DEFAULT 10.00,
    commission_percentage DECIMAL(5,2) DEFAULT 5.00,
    warranty_reserve_percentage DECIMAL(5,2) DEFAULT 3.00,
    tax_rate_percentage DECIMAL(5,2) DEFAULT 7.00,
    target_profit_percentage DECIMAL(5,2) DEFAULT 20.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Catalog Table
CREATE TABLE IF NOT EXISTS service_catalog (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_code TEXT UNIQUE NOT NULL,
    service_name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('maintenance', 'repair', 'installation', 'diagnostic', 'inspection')),
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    labor_hours DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('basic', 'intermediate', 'advanced', 'expert')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Labor Rates Table
CREATE TABLE IF NOT EXISTS labor_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rate_name TEXT NOT NULL,
    rate_type TEXT NOT NULL CHECK (rate_type IN ('standard', 'overtime', 'emergency', 'weekend', 'holiday')),
    hourly_rate DECIMAL(10,2) NOT NULL,
    skill_level TEXT NOT NULL CHECK (skill_level IN ('apprentice', 'technician', 'senior_technician', 'master_technician', 'specialist')),
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration Settings Table (for API keys)
CREATE TABLE IF NOT EXISTS integration_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    gemini_api_key TEXT,
    google_maps_api_key TEXT,
    twilio_account_sid TEXT,
    twilio_auth_token TEXT,
    twilio_phone_number TEXT,
    stripe_publishable_key TEXT,
    stripe_secret_key TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Vendors Table
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
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    po_number TEXT UNIQUE NOT NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    order_date DATE DEFAULT CURRENT_DATE,
    expected_delivery_date DATE,
    delivery_date DATE,
    status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'approved', 'ordered', 'shipped', 'received', 'cancelled')) DEFAULT 'draft',
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_cost DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    line_items JSONB DEFAULT '[]',
    shipping_address JSONB,
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    approved_by UUID REFERENCES profiles(id),
    approved_at TIMESTAMPTZ,
    received_by UUID REFERENCES profiles(id),
    received_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pricing_rules_active ON pricing_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_applies_to ON pricing_rules(applies_to);
CREATE INDEX IF NOT EXISTS idx_service_catalog_active ON service_catalog(is_active);
CREATE INDEX IF NOT EXISTS idx_service_catalog_category ON service_catalog(category);
CREATE INDEX IF NOT EXISTS idx_service_catalog_code ON service_catalog(service_code);
CREATE INDEX IF NOT EXISTS idx_labor_rates_active ON labor_rates(is_active);
CREATE INDEX IF NOT EXISTS idx_labor_rates_skill ON labor_rates(skill_level);
CREATE INDEX IF NOT EXISTS idx_vendors_active ON vendors(is_active);
CREATE INDEX IF NOT EXISTS idx_vendors_name ON vendors(vendor_name);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_vendor ON purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_date ON purchase_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_po_number ON purchase_orders(po_number);

-- Enable Row Level Security
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE labor_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

-- Pricing Rules Policies
DROP POLICY IF EXISTS "pricing_rules_select" ON pricing_rules;
CREATE POLICY "pricing_rules_select" ON pricing_rules FOR SELECT USING (true);

DROP POLICY IF EXISTS "pricing_rules_insert" ON pricing_rules;
CREATE POLICY "pricing_rules_insert" ON pricing_rules FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'manager')
    )
);

DROP POLICY IF EXISTS "pricing_rules_update" ON pricing_rules;
CREATE POLICY "pricing_rules_update" ON pricing_rules FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'manager')
    )
);

DROP POLICY IF EXISTS "pricing_rules_delete" ON pricing_rules;
CREATE POLICY "pricing_rules_delete" ON pricing_rules FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Service Catalog Policies
DROP POLICY IF EXISTS "service_catalog_select" ON service_catalog;
CREATE POLICY "service_catalog_select" ON service_catalog FOR SELECT USING (true);

DROP POLICY IF EXISTS "service_catalog_insert" ON service_catalog;
CREATE POLICY "service_catalog_insert" ON service_catalog FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'manager')
    )
);

DROP POLICY IF EXISTS "service_catalog_update" ON service_catalog;
CREATE POLICY "service_catalog_update" ON service_catalog FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'manager')
    )
);

DROP POLICY IF EXISTS "service_catalog_delete" ON service_catalog;
CREATE POLICY "service_catalog_delete" ON service_catalog FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Labor Rates Policies
DROP POLICY IF EXISTS "labor_rates_select" ON labor_rates;
CREATE POLICY "labor_rates_select" ON labor_rates FOR SELECT USING (true);

DROP POLICY IF EXISTS "labor_rates_insert" ON labor_rates;
CREATE POLICY "labor_rates_insert" ON labor_rates FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'manager')
    )
);

DROP POLICY IF EXISTS "labor_rates_update" ON labor_rates;
CREATE POLICY "labor_rates_update" ON labor_rates FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'manager')
    )
);

DROP POLICY IF EXISTS "labor_rates_delete" ON labor_rates;
CREATE POLICY "labor_rates_delete" ON labor_rates FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Integration Settings Policies (Admin only)
DROP POLICY IF EXISTS "integration_settings_select" ON integration_settings;
CREATE POLICY "integration_settings_select" ON integration_settings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'manager')
    )
);

DROP POLICY IF EXISTS "integration_settings_update" ON integration_settings;
CREATE POLICY "integration_settings_update" ON integration_settings FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Vendors Policies
DROP POLICY IF EXISTS "vendors_select" ON vendors;
CREATE POLICY "vendors_select" ON vendors FOR SELECT USING (true);

DROP POLICY IF EXISTS "vendors_insert" ON vendors;
CREATE POLICY "vendors_insert" ON vendors FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'manager')
    )
);

DROP POLICY IF EXISTS "vendors_update" ON vendors;
CREATE POLICY "vendors_update" ON vendors FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'manager')
    )
);

DROP POLICY IF EXISTS "vendors_delete" ON vendors;
CREATE POLICY "vendors_delete" ON vendors FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Purchase Orders Policies
DROP POLICY IF EXISTS "purchase_orders_select" ON purchase_orders;
CREATE POLICY "purchase_orders_select" ON purchase_orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "purchase_orders_insert" ON purchase_orders;
CREATE POLICY "purchase_orders_insert" ON purchase_orders FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'manager')
    )
);

DROP POLICY IF EXISTS "purchase_orders_update" ON purchase_orders;
CREATE POLICY "purchase_orders_update" ON purchase_orders FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'manager', 'dispatcher')
    )
);

DROP POLICY IF EXISTS "purchase_orders_delete" ON purchase_orders;
CREATE POLICY "purchase_orders_delete" ON purchase_orders FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Insert some default data
INSERT INTO labor_rates (rate_name, rate_type, hourly_rate, skill_level, is_default, is_active)
VALUES 
    ('Standard Technician', 'standard', 85.00, 'technician', true, true),
    ('Senior Technician', 'standard', 110.00, 'senior_technician', false, true),
    ('Master Technician', 'standard', 135.00, 'master_technician', false, true),
    ('Emergency Rate', 'emergency', 150.00, 'technician', false, true)
ON CONFLICT DO NOTHING;

INSERT INTO pricing_rules (rule_name, rule_type, applies_to, overhead_percentage, benefits_percentage, commission_percentage, warranty_reserve_percentage, tax_rate_percentage, target_profit_percentage, is_active)
VALUES 
    ('Standard Residential', 'standard', 'residential', 15.00, 10.00, 5.00, 3.00, 7.00, 20.00, true),
    ('Commercial Flat Rate', 'flat_rate', 'commercial', 18.00, 12.00, 3.00, 5.00, 7.00, 25.00, true)
ON CONFLICT DO NOTHING;

INSERT INTO service_catalog (service_code, service_name, description, category, base_price, labor_hours, difficulty_level, is_active)
VALUES 
    ('HVAC-001', 'AC Tune-Up', 'Complete air conditioning system inspection and tune-up', 'maintenance', 150.00, 1.5, 'intermediate', true),
    ('HVAC-002', 'Furnace Inspection', 'Annual furnace safety inspection and cleaning', 'maintenance', 125.00, 1.0, 'intermediate', true),
    ('HVAC-003', 'AC Unit Installation', 'Complete air conditioning unit installation', 'installation', 3500.00, 8.0, 'advanced', true),
    ('HVAC-004', 'Refrigerant Recharge', 'AC refrigerant leak detection and recharge', 'repair', 350.00, 2.0, 'intermediate', true),
    ('HVAC-005', 'Emergency AC Repair', 'Emergency air conditioning repair service', 'repair', 250.00, 2.0, 'advanced', true)
ON CONFLICT DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE pricing_rules IS 'Stores pricing calculation rules for different job types';
COMMENT ON TABLE service_catalog IS 'Master catalog of all available HVAC services';
COMMENT ON TABLE labor_rates IS 'Hourly labor rates by skill level and rate type';
COMMENT ON TABLE integration_settings IS 'API keys and integration configurations';
COMMENT ON TABLE vendors IS 'Vendor and supplier information';
COMMENT ON TABLE purchase_orders IS 'Purchase orders for parts and materials from vendors';
