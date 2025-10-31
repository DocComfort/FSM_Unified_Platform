-- =====================================================
-- Phase 5: Integration & Miscellaneous Tables
-- =====================================================
-- Created: 2025-10-13
-- Purpose: Add remaining tables for integrations, webhooks,
--          document management, and other misc features
-- Priority: LOW - Specialized features
-- =====================================================

-- =====================================================
-- INTEGRATION & API TABLES
-- =====================================================

-- Integrations
DROP TABLE IF EXISTS integrations CASCADE;
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_name VARCHAR(255) NOT NULL,
  integration_type VARCHAR(100) NOT NULL, -- 'accounting', 'payment', 'communication', 'crm', 'other'
  provider VARCHAR(100) NOT NULL, -- 'quickbooks', 'stripe', 'twillio', etc.
  status VARCHAR(50) DEFAULT 'inactive', -- 'active', 'inactive', 'error', 'pending'
  is_enabled BOOLEAN DEFAULT false,
  api_key TEXT,
  api_secret TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  config JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_integrations_type ON integrations(integration_type);
CREATE INDEX idx_integrations_status ON integrations(status);
CREATE INDEX idx_integrations_provider ON integrations(provider);

-- Webhooks
DROP TABLE IF EXISTS webhooks CASCADE;
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  event_types TEXT[] NOT NULL, -- Array of events to trigger on
  secret_key VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  retry_count INTEGER DEFAULT 3,
  timeout_seconds INTEGER DEFAULT 30,
  headers JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_webhooks_active ON webhooks(is_active);

-- Webhook Logs
DROP TABLE IF EXISTS webhook_logs CASCADE;
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES webhooks(id),
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  retry_attempt INTEGER DEFAULT 0,
  triggered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_logs_webhook ON webhook_logs(webhook_id);
CREATE INDEX idx_webhook_logs_event ON webhook_logs(event_type);
CREATE INDEX idx_webhook_logs_triggered ON webhook_logs(triggered_at);
CREATE INDEX idx_webhook_logs_success ON webhook_logs(success);

-- API Keys
DROP TABLE IF EXISTS api_keys CASCADE;
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  api_secret VARCHAR(255),
  scope TEXT[] DEFAULT '{}', -- Array of permissions
  is_active BOOLEAN DEFAULT true,
  rate_limit INTEGER DEFAULT 1000, -- requests per hour
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_api_keys_key ON api_keys(api_key);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);
CREATE INDEX idx_api_keys_expires ON api_keys(expires_at);

-- RLS for integration tables
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Integrations manageable by admins" ON integrations;
CREATE POLICY "Integrations manageable by admins" ON integrations FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin'))
);

DROP POLICY IF EXISTS "Webhooks manageable by admins" ON webhooks;
CREATE POLICY "Webhooks manageable by admins" ON webhooks FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin'))
);

DROP POLICY IF EXISTS "Webhook logs viewable by admins" ON webhook_logs;
CREATE POLICY "Webhook logs viewable by admins" ON webhook_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin'))
);

DROP POLICY IF EXISTS "API keys manageable by admins" ON api_keys;
CREATE POLICY "API keys manageable by admins" ON api_keys FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin'))
);


-- =====================================================
-- DOCUMENT MANAGEMENT TABLES
-- =====================================================

-- Document Templates
DROP TABLE IF EXISTS document_templates CASCADE;
CREATE TABLE document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name VARCHAR(255) NOT NULL,
  template_type VARCHAR(100) NOT NULL, -- 'invoice', 'estimate', 'work_order', 'contract', etc.
  content TEXT NOT NULL, -- HTML or markdown content
  variables JSONB DEFAULT '[]', -- Available template variables
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_document_templates_type ON document_templates(template_type);
CREATE INDEX idx_document_templates_active ON document_templates(is_active);

-- Document Shares (for sharing documents with customers)
DROP TABLE IF EXISTS document_shares CASCADE;
CREATE TABLE document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  share_token VARCHAR(255) UNIQUE NOT NULL,
  shared_with_email VARCHAR(255),
  shared_by UUID REFERENCES profiles(id) NOT NULL,
  expires_at TIMESTAMPTZ,
  password_hash VARCHAR(255),
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_document_shares_doc ON document_shares(document_id);
CREATE INDEX idx_document_shares_token ON document_shares(share_token);
CREATE INDEX idx_document_shares_expires ON document_shares(expires_at);

-- Signature Requests
DROP TABLE IF EXISTS signature_requests CASCADE;
CREATE TABLE signature_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  signer_name VARCHAR(255) NOT NULL,
  signer_email VARCHAR(255) NOT NULL,
  signature_data TEXT, -- Base64 encoded signature image
  signed_at TIMESTAMPTZ,
  ip_address INET,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'signed', 'declined', 'expired'
  request_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_signature_requests_doc ON signature_requests(document_id);
CREATE INDEX idx_signature_requests_customer ON signature_requests(customer_id);
CREATE INDEX idx_signature_requests_status ON signature_requests(status);
CREATE INDEX idx_signature_requests_token ON signature_requests(request_token);

-- RLS for document management
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE signature_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Templates viewable by authenticated" ON document_templates;
CREATE POLICY "Templates viewable by authenticated" ON document_templates FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Templates manageable by managers" ON document_templates;
CREATE POLICY "Templates manageable by managers" ON document_templates FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);

DROP POLICY IF EXISTS "Document shares viewable by creator" ON document_shares;
CREATE POLICY "Document shares viewable by creator" ON document_shares FOR SELECT TO authenticated USING (
  shared_by = auth.uid() 
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);

DROP POLICY IF EXISTS "Signature requests viewable by authenticated" ON signature_requests;
CREATE POLICY "Signature requests viewable by authenticated" ON signature_requests FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Signature requests manageable by staff" ON signature_requests;
CREATE POLICY "Signature requests manageable by staff" ON signature_requests FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);


-- =====================================================
-- PRICE BOOK TABLES
-- =====================================================

-- Price Book (master price lists)
DROP TABLE IF EXISTS price_book CASCADE;
CREATE TABLE price_book (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  effective_date DATE,
  expiration_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_price_book_active ON price_book(is_active);
CREATE INDEX idx_price_book_default ON price_book(is_default);

-- Price Book Items
DROP TABLE IF EXISTS price_book_items CASCADE;
CREATE TABLE price_book_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_book_id UUID REFERENCES price_book(id) ON DELETE CASCADE NOT NULL,
  item_type VARCHAR(50) NOT NULL, -- 'service', 'part', 'labor', 'equipment'
  item_id UUID, -- Reference to inventory_items or service_catalog
  item_code VARCHAR(100),
  item_name VARCHAR(255) NOT NULL,
  description TEXT,
  unit_price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  markup_percentage DECIMAL(5, 2),
  is_taxable BOOLEAN DEFAULT true,
  unit_of_measure VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_book_items_book ON price_book_items(price_book_id);
CREATE INDEX idx_price_book_items_type ON price_book_items(item_type);
CREATE INDEX idx_price_book_items_code ON price_book_items(item_code);

-- RLS for price book
ALTER TABLE price_book ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_book_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Price books viewable by authenticated" ON price_book;
CREATE POLICY "Price books viewable by authenticated" ON price_book FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Price books manageable by managers" ON price_book;
CREATE POLICY "Price books manageable by managers" ON price_book FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);

DROP POLICY IF EXISTS "Price book items viewable by authenticated" ON price_book_items;
CREATE POLICY "Price book items viewable by authenticated" ON price_book_items FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Price book items manageable by managers" ON price_book_items;
CREATE POLICY "Price book items manageable by managers" ON price_book_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);


-- =====================================================
-- SERVICE HISTORY TABLE
-- =====================================================

-- Service History (denormalized view of all services performed)
DROP TABLE IF EXISTS service_history CASCADE;
CREATE TABLE service_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) NOT NULL,
  equipment_id UUID REFERENCES equipment(id),
  job_id UUID REFERENCES jobs(id),
  service_date DATE NOT NULL,
  service_type VARCHAR(100),
  technician_id UUID REFERENCES employees(id),
  services_performed TEXT[] DEFAULT '{}',
  parts_used TEXT[] DEFAULT '{}',
  labor_hours DECIMAL(5, 2),
  total_cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_service_history_customer ON service_history(customer_id);
CREATE INDEX idx_service_history_equipment ON service_history(equipment_id);
CREATE INDEX idx_service_history_job ON service_history(job_id);
CREATE INDEX idx_service_history_date ON service_history(service_date);
CREATE INDEX idx_service_history_technician ON service_history(technician_id);

-- RLS for service history
ALTER TABLE service_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service history viewable by authenticated" ON service_history;
CREATE POLICY "Service history viewable by authenticated" ON service_history FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Service history insertable by staff" ON service_history;
CREATE POLICY "Service history insertable by staff" ON service_history FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager', 'technician'))
);


-- =====================================================
-- JOB LINE ITEMS TABLE (if needed separately from estimates/invoices)
-- =====================================================

DROP TABLE IF EXISTS job_line_items CASCADE;
CREATE TABLE job_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  line_number INTEGER NOT NULL,
  item_type VARCHAR(50) NOT NULL, -- 'service', 'part', 'labor', 'equipment', 'other'
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  line_total DECIMAL(10, 2) NOT NULL,
  inventory_item_id UUID REFERENCES inventory_items(id),
  service_catalog_id UUID REFERENCES service_catalog(id),
  labor_rate_id UUID REFERENCES labor_rates(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_job_line_items_job ON job_line_items(job_id);
CREATE INDEX idx_job_line_items_item_type ON job_line_items(item_type);

-- RLS for job line items
ALTER TABLE job_line_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Job line items viewable by authenticated" ON job_line_items;
CREATE POLICY "Job line items viewable by authenticated" ON job_line_items FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Job line items manageable by technicians" ON job_line_items;
CREATE POLICY "Job line items manageable by technicians" ON job_line_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager', 'technician'))
);


-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to generate next employee number
CREATE OR REPLACE FUNCTION generate_employee_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  next_number INTEGER;
  new_number VARCHAR(50);
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(employee_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM employees
  WHERE employee_number ~ '^EMP[0-9]+$';
  
  new_number := 'EMP' || LPAD(next_number::TEXT, 5, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate next payment number
CREATE OR REPLACE FUNCTION generate_payment_number()
RETURNS VARCHAR(100) AS $$
DECLARE
  next_number INTEGER;
  new_number VARCHAR(100);
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(payment_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM payments
  WHERE payment_number ~ '^PAY[0-9]+$';
  
  new_number := 'PAY' || LPAD(next_number::TEXT, 6, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate next service agreement number
CREATE OR REPLACE FUNCTION generate_agreement_number()
RETURNS VARCHAR(100) AS $$
DECLARE
  next_number INTEGER;
  new_number VARCHAR(100);
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(agreement_number FROM 3) AS INTEGER)), 0) + 1
  INTO next_number
  FROM service_agreements
  WHERE agreement_number ~ '^SA[0-9]+$';
  
  new_number := 'SA' || LPAD(next_number::TEXT, 6, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update inventory stock after transaction
CREATE OR REPLACE FUNCTION update_inventory_stock_after_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- For receipts, increase stock at to_location
  IF NEW.transaction_type = 'receive' AND NEW.to_location_id IS NOT NULL THEN
    INSERT INTO inventory_stock (item_id, location_id, quantity_on_hand)
    VALUES (NEW.item_id, NEW.to_location_id, NEW.quantity)
    ON CONFLICT (item_id, location_id)
    DO UPDATE SET 
      quantity_on_hand = inventory_stock.quantity_on_hand + NEW.quantity,
      last_movement_date = NOW();
  
  -- For issues, decrease stock at from_location
  ELSIF NEW.transaction_type = 'issue' AND NEW.from_location_id IS NOT NULL THEN
    UPDATE inventory_stock
    SET 
      quantity_on_hand = quantity_on_hand - NEW.quantity,
      last_movement_date = NOW()
    WHERE item_id = NEW.item_id AND location_id = NEW.from_location_id;
  
  -- For transfers, decrease from and increase to
  ELSIF NEW.transaction_type = 'transfer' AND NEW.from_location_id IS NOT NULL AND NEW.to_location_id IS NOT NULL THEN
    -- Decrease from location
    UPDATE inventory_stock
    SET 
      quantity_on_hand = quantity_on_hand - NEW.quantity,
      last_movement_date = NOW()
    WHERE item_id = NEW.item_id AND location_id = NEW.from_location_id;
    
    -- Increase to location
    INSERT INTO inventory_stock (item_id, location_id, quantity_on_hand)
    VALUES (NEW.item_id, NEW.to_location_id, NEW.quantity)
    ON CONFLICT (item_id, location_id)
    DO UPDATE SET 
      quantity_on_hand = inventory_stock.quantity_on_hand + NEW.quantity,
      last_movement_date = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for inventory transactions
CREATE TRIGGER trigger_update_inventory_stock
  AFTER INSERT ON inventory_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_stock_after_transaction();

-- Function to update message count on threads
CREATE OR REPLACE FUNCTION update_thread_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE communication_threads
  SET 
    message_count = message_count + 1,
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.message, 100),
    updated_at = NOW()
  WHERE id = NEW.thread_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for communication messages
CREATE TRIGGER trigger_update_thread_on_message
  AFTER INSERT ON communication_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_message_count();


-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE integrations IS 'Third-party integration configurations';
COMMENT ON TABLE webhooks IS 'Outbound webhook configurations';
COMMENT ON TABLE webhook_logs IS 'Webhook execution logs';
COMMENT ON TABLE api_keys IS 'API access keys for external integrations';
COMMENT ON TABLE document_templates IS 'Document templates for invoices, estimates, etc.';
COMMENT ON TABLE document_shares IS 'Secure document sharing with customers';
COMMENT ON TABLE signature_requests IS 'Digital signature requests for documents';
COMMENT ON TABLE price_book IS 'Master price list definitions';
COMMENT ON TABLE price_book_items IS 'Items in price books';
COMMENT ON TABLE service_history IS 'Complete service history for customers and equipment';
COMMENT ON TABLE job_line_items IS 'Line items for jobs (parts/services used)';

-- =====================================================
-- END OF PHASE 5 MIGRATION
-- =====================================================
