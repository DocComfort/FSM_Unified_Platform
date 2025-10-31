-- =====================================================
-- Phase 2: Critical Business Tables Migration (FIXED)
-- =====================================================
-- Created: 2025-10-13 (Revised - Dependency Order Fixed)
-- Purpose: Add core business tables needed for employee management,
--          inventory, and detailed billing
-- Priority: HIGH - Fixes 68+ critical errors
-- 
-- IMPORTANT: Tables are ordered by dependencies
-- =====================================================

-- =====================================================
-- 1. EMPLOYEES TABLE
-- =====================================================
DROP TABLE IF EXISTS employees CASCADE;

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Basic Information
  employee_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  phone_extension VARCHAR(10),
  
  -- Employment Details
  role VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  title VARCHAR(100),
  hire_date DATE NOT NULL,
  termination_date DATE,
  employment_type VARCHAR(50) DEFAULT 'full_time',
  
  -- Work Schedule
  default_hourly_rate DECIMAL(10, 2),
  overtime_rate DECIMAL(10, 2),
  weekly_hours INTEGER DEFAULT 40,
  
  -- Skills & Certifications
  skills TEXT[],
  certifications JSONB DEFAULT '[]',
  license_number VARCHAR(100),
  license_expiry DATE,
  
  -- Contact & Emergency
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zipcode VARCHAR(10),
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(50),
  
  -- Payroll
  payroll_id VARCHAR(100),
  tax_id VARCHAR(50),
  bank_account_last_4 VARCHAR(4),
  payment_method VARCHAR(50) DEFAULT 'direct_deposit',
  
  -- Settings & Status
  is_active BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'active',
  can_clock_in BOOLEAN DEFAULT true,
  can_receive_jobs BOOLEAN DEFAULT true,
  avatar_url TEXT,
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_employees_employee_number ON employees(employee_number);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_is_active ON employees(is_active);
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_profile_id ON employees(profile_id);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Employees viewable by authenticated users" ON employees;
CREATE POLICY "Employees viewable by authenticated users" ON employees
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Employees manageable by admins" ON employees;
CREATE POLICY "Employees manageable by admins" ON employees
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

COMMENT ON TABLE employees IS 'Employee records with full employment details';

-- =====================================================
-- 2. INVENTORY ITEMS TABLE
-- =====================================================
DROP TABLE IF EXISTS inventory_items CASCADE;

CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  item_number VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  manufacturer VARCHAR(200),
  model_number VARCHAR(100),
  part_number VARCHAR(100),
  
  -- Inventory Management
  unit_of_measure VARCHAR(50) DEFAULT 'each',
  min_quantity DECIMAL(10, 2) DEFAULT 0,
  max_quantity DECIMAL(10, 2),
  reorder_point DECIMAL(10, 2),
  reorder_quantity DECIMAL(10, 2),
  lead_time_days INTEGER,
  
  -- Pricing
  cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  markup_percent DECIMAL(5, 2) DEFAULT 0,
  sell_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  msrp DECIMAL(10, 2),
  
  -- Physical Properties
  weight DECIMAL(10, 2),
  weight_unit VARCHAR(20) DEFAULT 'lbs',
  dimensions VARCHAR(100),
  
  -- Stock Tracking
  is_serialized BOOLEAN DEFAULT false,
  is_lot_tracked BOOLEAN DEFAULT false,
  is_perishable BOOLEAN DEFAULT false,
  shelf_life_days INTEGER,
  
  -- Vendor Information
  primary_vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  vendor_part_number VARCHAR(100),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_taxable BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'active',
  
  -- Images & Documents
  image_url TEXT,
  images JSONB DEFAULT '[]',
  spec_sheet_url TEXT,
  
  -- Metadata
  notes TEXT,
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_inventory_items_item_number ON inventory_items(item_number);
CREATE INDEX idx_inventory_items_name ON inventory_items(name);
CREATE INDEX idx_inventory_items_category ON inventory_items(category);
CREATE INDEX idx_inventory_items_status ON inventory_items(status);
CREATE INDEX idx_inventory_items_is_active ON inventory_items(is_active);
CREATE INDEX idx_inventory_items_manufacturer ON inventory_items(manufacturer);
CREATE INDEX idx_inventory_items_part_number ON inventory_items(part_number);
CREATE INDEX idx_inventory_items_vendor ON inventory_items(primary_vendor_id);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Inventory items viewable by authenticated users" ON inventory_items;
CREATE POLICY "Inventory items viewable by authenticated users" ON inventory_items
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Inventory items manageable by staff" ON inventory_items;
CREATE POLICY "Inventory items manageable by staff" ON inventory_items
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

COMMENT ON TABLE inventory_items IS 'Master catalog of all inventory items, parts, and equipment';

-- =====================================================
-- 3. ESTIMATE LINE ITEMS TABLE
-- =====================================================
DROP TABLE IF EXISTS estimate_line_items CASCADE;

CREATE TABLE estimate_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE NOT NULL,
  
  -- Line Item Details
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  
  -- Pricing
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) GENERATED ALWAYS AS (
    ((quantity * unit_price) - discount_amount) * (tax_rate / 100)
  ) STORED,
  line_total DECIMAL(10, 2) GENERATED ALWAYS AS (
    ((quantity * unit_price) - discount_amount) + 
    (((quantity * unit_price) - discount_amount) * (tax_rate / 100))
  ) STORED,
  
  -- References
  inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  service_catalog_id UUID REFERENCES service_catalog(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_estimate_line_items_estimate_id ON estimate_line_items(estimate_id);
CREATE INDEX idx_estimate_line_items_item_type ON estimate_line_items(item_type);
CREATE INDEX idx_estimate_line_items_inventory_item ON estimate_line_items(inventory_item_id);

ALTER TABLE estimate_line_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Estimate line items viewable by authenticated users" ON estimate_line_items;
CREATE POLICY "Estimate line items viewable by authenticated users" ON estimate_line_items
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Estimate line items manageable by staff" ON estimate_line_items;
CREATE POLICY "Estimate line items manageable by staff" ON estimate_line_items
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

COMMENT ON TABLE estimate_line_items IS 'Detailed line items for estimates';

-- =====================================================
-- 4. INVOICE LINE ITEMS TABLE
-- =====================================================
DROP TABLE IF EXISTS invoice_line_items CASCADE;

CREATE TABLE invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  
  -- Line Item Details
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  
  -- Pricing
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) GENERATED ALWAYS AS (
    ((quantity * unit_price) - discount_amount) * (tax_rate / 100)
  ) STORED,
  line_total DECIMAL(10, 2) GENERATED ALWAYS AS (
    ((quantity * unit_price) - discount_amount) + 
    (((quantity * unit_price) - discount_amount) * (tax_rate / 100))
  ) STORED,
  
  -- References
  inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  service_catalog_id UUID REFERENCES service_catalog(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoice_line_items_invoice_id ON invoice_line_items(invoice_id);
CREATE INDEX idx_invoice_line_items_item_type ON invoice_line_items(item_type);
CREATE INDEX idx_invoice_line_items_inventory_item ON invoice_line_items(inventory_item_id);
CREATE INDEX idx_invoice_line_items_job_id ON invoice_line_items(job_id);

ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Invoice line items viewable by authenticated users" ON invoice_line_items;
CREATE POLICY "Invoice line items viewable by authenticated users" ON invoice_line_items
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Invoice line items manageable by staff" ON invoice_line_items;
CREATE POLICY "Invoice line items manageable by staff" ON invoice_line_items
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

COMMENT ON TABLE invoice_line_items IS 'Detailed line items for invoices';

-- =====================================================
-- 5. INVENTORY LOCATIONS TABLE
-- =====================================================
DROP TABLE IF EXISTS inventory_locations CASCADE;

CREATE TABLE inventory_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Location Details
  location_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  location_type VARCHAR(50) NOT NULL,
  
  -- Address
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zipcode VARCHAR(10),
  
  -- Management
  manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  assigned_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_mobile BOOLEAN DEFAULT false,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_locations_code ON inventory_locations(location_code);
CREATE INDEX idx_inventory_locations_type ON inventory_locations(location_type);
CREATE INDEX idx_inventory_locations_is_active ON inventory_locations(is_active);
CREATE INDEX idx_inventory_locations_manager ON inventory_locations(manager_id);

ALTER TABLE inventory_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Inventory locations viewable by authenticated users" ON inventory_locations;
CREATE POLICY "Inventory locations viewable by authenticated users" ON inventory_locations
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Inventory locations manageable by managers" ON inventory_locations;
CREATE POLICY "Inventory locations manageable by managers" ON inventory_locations
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

COMMENT ON TABLE inventory_locations IS 'Physical locations where inventory is stored';

-- =====================================================
-- 6. INVENTORY STOCK TABLE
-- =====================================================
DROP TABLE IF EXISTS inventory_stock CASCADE;

CREATE TABLE inventory_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES inventory_locations(id) ON DELETE CASCADE NOT NULL,
  
  -- Stock Levels
  quantity_on_hand DECIMAL(10, 2) NOT NULL DEFAULT 0,
  quantity_allocated DECIMAL(10, 2) DEFAULT 0,
  quantity_available DECIMAL(10, 2) GENERATED ALWAYS AS (quantity_on_hand - quantity_allocated) STORED,
  quantity_on_order DECIMAL(10, 2) DEFAULT 0,
  
  -- Lot/Serial Tracking
  lot_number VARCHAR(100),
  serial_numbers TEXT[],
  
  -- Timestamps
  last_counted_at TIMESTAMPTZ,
  last_counted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(inventory_item_id, location_id)
);

CREATE INDEX idx_inventory_stock_item ON inventory_stock(inventory_item_id);
CREATE INDEX idx_inventory_stock_location ON inventory_stock(location_id);
CREATE INDEX idx_inventory_stock_quantity ON inventory_stock(quantity_available);

ALTER TABLE inventory_stock ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Inventory stock viewable by authenticated users" ON inventory_stock;
CREATE POLICY "Inventory stock viewable by authenticated users" ON inventory_stock
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Inventory stock manageable by staff" ON inventory_stock;
CREATE POLICY "Inventory stock manageable by staff" ON inventory_stock
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

COMMENT ON TABLE inventory_stock IS 'Current stock levels for each item at each location';

-- =====================================================
-- 7. INVENTORY TRANSACTIONS TABLE
-- =====================================================
DROP TABLE IF EXISTS inventory_transactions CASCADE;

CREATE TABLE inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Transaction Details
  transaction_number VARCHAR(100) UNIQUE NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Item & Location
  inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
  from_location_id UUID REFERENCES inventory_locations(id) ON DELETE SET NULL,
  to_location_id UUID REFERENCES inventory_locations(id) ON DELETE SET NULL,
  
  -- Quantity
  quantity DECIMAL(10, 2) NOT NULL,
  unit_cost DECIMAL(10, 2),
  total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * COALESCE(unit_cost, 0)) STORED,
  
  -- References
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Details
  reason VARCHAR(100),
  notes TEXT,
  lot_number VARCHAR(100),
  serial_number VARCHAR(100),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_inventory_transactions_number ON inventory_transactions(transaction_number);
CREATE INDEX idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX idx_inventory_transactions_date ON inventory_transactions(transaction_date);
CREATE INDEX idx_inventory_transactions_item ON inventory_transactions(inventory_item_id);
CREATE INDEX idx_inventory_transactions_from_location ON inventory_transactions(from_location_id);
CREATE INDEX idx_inventory_transactions_to_location ON inventory_transactions(to_location_id);
CREATE INDEX idx_inventory_transactions_job ON inventory_transactions(job_id);

ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Inventory transactions viewable by authenticated users" ON inventory_transactions;
CREATE POLICY "Inventory transactions viewable by authenticated users" ON inventory_transactions
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Inventory transactions manageable by staff" ON inventory_transactions;
CREATE POLICY "Inventory transactions manageable by staff" ON inventory_transactions
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

COMMENT ON TABLE inventory_transactions IS 'Complete audit trail of all inventory movements';

-- =====================================================
-- 8. INVENTORY TRANSFER REQUESTS TABLE
-- =====================================================
DROP TABLE IF EXISTS inventory_transfer_requests CASCADE;

CREATE TABLE inventory_transfer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Request Details
  request_number VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'normal',
  
  -- Transfer Details
  inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
  from_location_id UUID REFERENCES inventory_locations(id) ON DELETE SET NULL NOT NULL,
  to_location_id UUID REFERENCES inventory_locations(id) ON DELETE SET NULL NOT NULL,
  quantity_requested DECIMAL(10, 2) NOT NULL,
  quantity_shipped DECIMAL(10, 2) DEFAULT 0,
  quantity_received DECIMAL(10, 2) DEFAULT 0,
  
  -- Dates
  requested_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  needed_by_date DATE,
  approved_date TIMESTAMPTZ,
  shipped_date TIMESTAMPTZ,
  received_date TIMESTAMPTZ,
  
  -- People
  requested_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  shipped_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  received_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Details
  reason TEXT,
  notes TEXT,
  rejection_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_transfers_number ON inventory_transfer_requests(request_number);
CREATE INDEX idx_inventory_transfers_status ON inventory_transfer_requests(status);
CREATE INDEX idx_inventory_transfers_item ON inventory_transfer_requests(inventory_item_id);
CREATE INDEX idx_inventory_transfers_from_location ON inventory_transfer_requests(from_location_id);
CREATE INDEX idx_inventory_transfers_to_location ON inventory_transfer_requests(to_location_id);
CREATE INDEX idx_inventory_transfers_requested_by ON inventory_transfer_requests(requested_by);

ALTER TABLE inventory_transfer_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Transfer requests viewable by authenticated users" ON inventory_transfer_requests;
CREATE POLICY "Transfer requests viewable by authenticated users" ON inventory_transfer_requests
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Transfer requests creatable by employees" ON inventory_transfer_requests;
CREATE POLICY "Transfer requests creatable by employees" ON inventory_transfer_requests
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE employees.user_id = auth.uid() 
      AND employees.is_active = true
    )
  );

DROP POLICY IF EXISTS "Transfer requests manageable by managers" ON inventory_transfer_requests;
CREATE POLICY "Transfer requests manageable by managers" ON inventory_transfer_requests
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

COMMENT ON TABLE inventory_transfer_requests IS 'Requests to transfer inventory between locations';

-- =====================================================
-- 9. PURCHASE ORDER LINE ITEMS TABLE
-- =====================================================
DROP TABLE IF EXISTS po_line_items CASCADE;

CREATE TABLE po_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE NOT NULL,
  
  -- Line Item Details
  line_number INTEGER NOT NULL,
  inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  
  -- Quantities
  quantity_ordered DECIMAL(10, 2) NOT NULL,
  quantity_received DECIMAL(10, 2) DEFAULT 0,
  quantity_remaining DECIMAL(10, 2) GENERATED ALWAYS AS (quantity_ordered - quantity_received) STORED,
  
  -- Pricing
  unit_cost DECIMAL(10, 2) NOT NULL,
  line_total DECIMAL(10, 2) GENERATED ALWAYS AS (quantity_ordered * unit_cost) STORED,
  
  -- Receiving
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_po_line_items_po ON po_line_items(purchase_order_id);
CREATE INDEX idx_po_line_items_inventory_item ON po_line_items(inventory_item_id);

ALTER TABLE po_line_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "PO line items viewable by authenticated users" ON po_line_items;
CREATE POLICY "PO line items viewable by authenticated users" ON po_line_items
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "PO line items manageable by staff" ON po_line_items;
CREATE POLICY "PO line items manageable by staff" ON po_line_items
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

COMMENT ON TABLE po_line_items IS 'Line items for purchase orders';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Phase 2 Migration Complete!';
  RAISE NOTICE '   - Created 9 critical business tables';
  RAISE NOTICE '   - Added employees table';
  RAISE NOTICE '   - Added complete inventory system';
  RAISE NOTICE '   - Added line items for estimates and invoices';
  RAISE NOTICE '   - All RLS policies and indexes created';
END $$;
