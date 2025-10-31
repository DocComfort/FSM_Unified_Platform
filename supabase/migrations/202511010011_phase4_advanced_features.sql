-- =====================================================
-- Phase 4: Advanced Features Migration
-- =====================================================
-- Created: 2025-10-13
-- Purpose: Add remaining tables for tools, workflows, notifications,
--          customer portal, fleet, integrations, and business intelligence
-- Priority: LOW - Nice-to-have features
-- =====================================================

-- =====================================================
-- TOOL TRACKING TABLES
-- =====================================================

-- Tool Assignments Tracking
DROP TABLE IF EXISTS tool_assignments_tracking CASCADE;
CREATE TABLE tool_assignments_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES equipment(id) ON DELETE CASCADE NOT NULL, -- Tools stored as equipment
  assigned_to_employee_id UUID REFERENCES employees(id),
  assigned_to_location_id UUID REFERENCES inventory_locations(id),
  assignment_date TIMESTAMPTZ DEFAULT NOW(),
  return_date TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'assigned', -- 'assigned', 'returned', 'lost', 'damaged'
  condition_at_assignment VARCHAR(100),
  condition_at_return VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tool_assignments_tool ON tool_assignments_tracking(tool_id);
CREATE INDEX idx_tool_assignments_employee ON tool_assignments_tracking(assigned_to_employee_id);
CREATE INDEX idx_tool_assignments_status ON tool_assignments_tracking(status);

-- Tool Assignment History
DROP TABLE IF EXISTS tool_assignment_history CASCADE;
CREATE TABLE tool_assignment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES equipment(id) NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'assigned', 'returned', 'transferred', 'reported_lost', 'reported_damaged'
  from_employee_id UUID REFERENCES employees(id),
  to_employee_id UUID REFERENCES employees(id),
  from_location_id UUID REFERENCES inventory_locations(id),
  to_location_id UUID REFERENCES inventory_locations(id),
  action_date TIMESTAMPTZ DEFAULT NOW(),
  performed_by UUID REFERENCES employees(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tool_history_tool ON tool_assignment_history(tool_id);
CREATE INDEX idx_tool_history_date ON tool_assignment_history(action_date);

-- RLS
ALTER TABLE tool_assignments_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_assignment_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tool assignments viewable by authenticated" ON tool_assignments_tracking;
CREATE POLICY "Tool assignments viewable by authenticated" ON tool_assignments_tracking FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Tool assignments manageable by staff" ON tool_assignments_tracking;
CREATE POLICY "Tool assignments manageable by staff" ON tool_assignments_tracking FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);

DROP POLICY IF EXISTS "Tool history viewable by authenticated" ON tool_assignment_history;
CREATE POLICY "Tool history viewable by authenticated" ON tool_assignment_history FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Tool history insertable by staff" ON tool_assignment_history;
CREATE POLICY "Tool history insertable by staff" ON tool_assignment_history FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager', 'technician'))
);


-- =====================================================
-- SYSTEM & WORKFLOW TABLES
-- =====================================================

-- System Settings
DROP TABLE IF EXISTS system_settings CASCADE;
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
  category VARCHAR(100), -- 'general', 'email', 'sms', 'billing', 'scheduling', etc.
  description TEXT,
  is_sensitive BOOLEAN DEFAULT false,
  is_editable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX idx_system_settings_category ON system_settings(category);

-- Workflow Automations
DROP TABLE IF EXISTS workflow_automations CASCADE;
CREATE TABLE workflow_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(100) NOT NULL, -- 'job_status_change', 'invoice_created', 'customer_created', etc.
  trigger_conditions JSONB DEFAULT '{}',
  actions JSONB NOT NULL, -- Array of actions to perform
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  execution_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_workflow_automations_trigger ON workflow_automations(trigger_type);
CREATE INDEX idx_workflow_automations_active ON workflow_automations(is_active);

-- Automation Logs
DROP TABLE IF EXISTS automation_logs CASCADE;
CREATE TABLE automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID REFERENCES workflow_automations(id),
  trigger_event VARCHAR(100) NOT NULL,
  trigger_data JSONB,
  execution_status VARCHAR(50) DEFAULT 'success', -- 'success', 'failed', 'partial'
  actions_performed JSONB DEFAULT '[]',
  error_message TEXT,
  execution_time_ms INTEGER,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_automation_logs_automation ON automation_logs(automation_id);
CREATE INDEX idx_automation_logs_date ON automation_logs(executed_at);
CREATE INDEX idx_automation_logs_status ON automation_logs(execution_status);

-- Workflow Executions
DROP TABLE IF EXISTS workflow_executions CASCADE;
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100), -- 'job', 'customer', 'invoice', etc.
  entity_id UUID,
  status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed', 'cancelled'
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER,
  steps_completed JSONB DEFAULT '[]',
  error_details TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_workflow_executions_entity ON workflow_executions(entity_type, entity_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);

-- RLS for system tables
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Settings viewable by admins" ON system_settings;
CREATE POLICY "Settings viewable by admins" ON system_settings FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin'))
);
DROP POLICY IF EXISTS "Settings manageable by admins" ON system_settings;
CREATE POLICY "Settings manageable by admins" ON system_settings FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin'))
);

DROP POLICY IF EXISTS "Workflows viewable by managers" ON workflow_automations;
CREATE POLICY "Workflows viewable by managers" ON workflow_automations FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);
DROP POLICY IF EXISTS "Workflows manageable by managers" ON workflow_automations;
CREATE POLICY "Workflows manageable by managers" ON workflow_automations FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);

DROP POLICY IF EXISTS "Automation logs viewable by managers" ON automation_logs;
CREATE POLICY "Automation logs viewable by managers" ON automation_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);

DROP POLICY IF EXISTS "Workflow executions viewable by staff" ON workflow_executions;
CREATE POLICY "Workflow executions viewable by staff" ON workflow_executions FOR SELECT TO authenticated USING (true);


-- =====================================================
-- NOTIFICATION SYSTEM TABLES
-- =====================================================

-- Notifications
DROP TABLE IF EXISTS notifications CASCADE;
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  notification_type VARCHAR(100) NOT NULL, -- 'info', 'warning', 'success', 'error', 'action_required'
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  action_label VARCHAR(100),
  priority VARCHAR(50) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  category VARCHAR(100), -- 'job', 'invoice', 'customer', 'system', etc.
  entity_type VARCHAR(100),
  entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_dismissed BOOLEAN DEFAULT false,
  dismissed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_notifications_type ON notifications(notification_type);

-- Notification Queue
DROP TABLE IF EXISTS notification_queue CASCADE;
CREATE TABLE notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'push', 'in_app'
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(20),
  recipient_user_id UUID REFERENCES profiles(id),
  subject VARCHAR(500),
  body TEXT NOT NULL,
  template_name VARCHAR(255),
  template_data JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'sent', 'failed', 'cancelled'
  priority INTEGER DEFAULT 5,
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_queue_status ON notification_queue(status);
CREATE INDEX idx_notification_queue_scheduled ON notification_queue(scheduled_for);
CREATE INDEX idx_notification_queue_type ON notification_queue(notification_type);

-- Notification Preferences
DROP TABLE IF EXISTS notification_preferences CASCADE;
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  job_assigned BOOLEAN DEFAULT true,
  job_completed BOOLEAN DEFAULT true,
  invoice_created BOOLEAN DEFAULT true,
  payment_received BOOLEAN DEFAULT true,
  customer_message BOOLEAN DEFAULT true,
  team_mention BOOLEAN DEFAULT true,
  system_alerts BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_prefs_user ON notification_preferences(user_id);

-- Notification Logs
DROP TABLE IF EXISTS notification_logs CASCADE;
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type VARCHAR(50) NOT NULL,
  recipient VARCHAR(500) NOT NULL,
  subject VARCHAR(500),
  status VARCHAR(50) NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_notification_logs_type ON notification_logs(notification_type);
CREATE INDEX idx_notification_logs_status ON notification_logs(status);
CREATE INDEX idx_notification_logs_sent ON notification_logs(sent_at);

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own notifications" ON notifications;
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT TO authenticated USING (recipient_id = auth.uid());
DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE TO authenticated USING (recipient_id = auth.uid());

DROP POLICY IF EXISTS "Queue viewable by admins" ON notification_queue;
CREATE POLICY "Queue viewable by admins" ON notification_queue FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin'))
);

DROP POLICY IF EXISTS "Users manage own preferences" ON notification_preferences;
CREATE POLICY "Users manage own preferences" ON notification_preferences FOR ALL TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Logs viewable by admins" ON notification_logs;
CREATE POLICY "Logs viewable by admins" ON notification_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin'))
);


-- =====================================================
-- CUSTOMER PORTAL TABLES
-- =====================================================

-- Customer Portal Tokens
DROP TABLE IF EXISTS customer_portal_tokens CASCADE;
CREATE TABLE customer_portal_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  token_type VARCHAR(50) DEFAULT 'access', -- 'access', 'reset_password', 'verify_email'
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portal_tokens_customer ON customer_portal_tokens(customer_id);
CREATE INDEX idx_portal_tokens_token ON customer_portal_tokens(token);
CREATE INDEX idx_portal_tokens_expires ON customer_portal_tokens(expires_at);

-- Payments
DROP TABLE IF EXISTS payments CASCADE;
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  payment_number VARCHAR(100) UNIQUE NOT NULL,
  payment_date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- 'cash', 'check', 'credit_card', 'ach', 'wire', 'other'
  payment_processor VARCHAR(100), -- 'stripe', 'square', 'paypal', 'authorize_net', etc.
  transaction_id VARCHAR(255),
  reference_number VARCHAR(255),
  check_number VARCHAR(100),
  card_last_four VARCHAR(4),
  status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
  notes TEXT,
  processed_by UUID REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);

-- RLS for customer portal
ALTER TABLE customer_portal_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tokens manageable by system" ON customer_portal_tokens;
CREATE POLICY "Tokens manageable by system" ON customer_portal_tokens FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Payments viewable by authenticated" ON payments;
CREATE POLICY "Payments viewable by authenticated" ON payments FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Payments insertable by staff" ON payments;
CREATE POLICY "Payments insertable by staff" ON payments FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);


-- =====================================================
-- BUSINESS INTELLIGENCE TABLES
-- =====================================================

-- Business Metrics
DROP TABLE IF EXISTS business_metrics CASCADE;
CREATE TABLE business_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  metric_type VARCHAR(100) NOT NULL,
  metric_name VARCHAR(255) NOT NULL,
  metric_value DECIMAL(15, 2) NOT NULL,
  metric_unit VARCHAR(50),
  category VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_business_metrics_date ON business_metrics(metric_date);
CREATE INDEX idx_business_metrics_type ON business_metrics(metric_type);
CREATE INDEX idx_business_metrics_name ON business_metrics(metric_name);

-- Audit Logs
DROP TABLE IF EXISTS audit_logs CASCADE;
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- RLS for business intelligence
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Metrics viewable by managers" ON business_metrics;
CREATE POLICY "Metrics viewable by managers" ON business_metrics FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);

DROP POLICY IF EXISTS "Audit logs viewable by admins" ON audit_logs;
CREATE POLICY "Audit logs viewable by admins" ON audit_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin'))
);


-- =====================================================
-- MISC SUPPORTING TABLES
-- =====================================================

-- Documents (generic file storage)
DROP TABLE IF EXISTS documents CASCADE;
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  document_type VARCHAR(100),
  file_name VARCHAR(500) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(255),
  description TEXT,
  tags TEXT[],
  uploaded_by UUID REFERENCES profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false
);

CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_type ON documents(document_type);

-- Route History
DROP TABLE IF EXISTS route_history CASCADE;
CREATE TABLE route_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) NOT NULL,
  route_date DATE NOT NULL,
  jobs UUID[] DEFAULT '{}',
  total_distance DECIMAL(10, 2),
  total_duration INTEGER,
  start_location JSONB,
  end_location JSONB,
  route_path JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_route_history_employee ON route_history(employee_id);
CREATE INDEX idx_route_history_date ON route_history(route_date);

-- Route Optimizations (planned routes)
DROP TABLE IF EXISTS route_optimizations CASCADE;
CREATE TABLE route_optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  optimization_date DATE NOT NULL,
  employee_id UUID REFERENCES employees(id),
  jobs UUID[] NOT NULL,
  optimized_order UUID[],
  estimated_distance DECIMAL(10, 2),
  estimated_duration INTEGER,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_route_optimizations_date ON route_optimizations(optimization_date);
CREATE INDEX idx_route_optimizations_employee ON route_optimizations(employee_id);

-- Marketing Campaigns
DROP TABLE IF EXISTS marketing_campaigns CASCADE;
CREATE TABLE marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name VARCHAR(255) NOT NULL,
  campaign_type VARCHAR(100),
  description TEXT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'draft',
  target_audience JSONB DEFAULT '{}',
  budget DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  leads_generated INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_marketing_campaigns_dates ON marketing_campaigns(start_date, end_date);
CREATE INDEX idx_marketing_campaigns_status ON marketing_campaigns(status);

-- Diagnostic Pricing Suggestions (for MeasureQuick integration)
DROP TABLE IF EXISTS diagnostic_pricing_suggestions CASCADE;
CREATE TABLE diagnostic_pricing_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) NOT NULL,
  diagnostic_report_id UUID,
  issue_type VARCHAR(255) NOT NULL,
  severity VARCHAR(50),
  suggested_service TEXT NOT NULL,
  suggested_price DECIMAL(10, 2),
  confidence_score DECIMAL(5, 2),
  priority INTEGER,
  status VARCHAR(50) DEFAULT 'pending',
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_diagnostic_suggestions_job ON diagnostic_pricing_suggestions(job_id);
CREATE INDEX idx_diagnostic_suggestions_status ON diagnostic_pricing_suggestions(status);

-- MeasureQuick Equipment Data
DROP TABLE IF EXISTS measurequick_equipment_data CASCADE;
CREATE TABLE measurequick_equipment_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) NOT NULL,
  job_id UUID REFERENCES jobs(id),
  measurequick_report_id VARCHAR(255),
  readings JSONB NOT NULL,
  diagnostics JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  efficiency_rating DECIMAL(5, 2),
  health_score INTEGER,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_measurequick_equipment ON measurequick_equipment_data(equipment_id);
CREATE INDEX idx_measurequick_job ON measurequick_equipment_data(job_id);

-- Geofences
DROP TABLE IF EXISTS geofences CASCADE;
CREATE TABLE geofences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  geofence_type VARCHAR(100), -- 'customer_site', 'office', 'warehouse', 'service_area'
  center_location JSONB NOT NULL,
  radius_meters INTEGER NOT NULL,
  polygon JSONB,
  is_active BOOLEAN DEFAULT true,
  customer_id UUID REFERENCES customers(id),
  location_id UUID REFERENCES inventory_locations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_geofences_type ON geofences(geofence_type);
CREATE INDEX idx_geofences_active ON geofences(is_active);

-- Location Events
DROP TABLE IF EXISTS location_events CASCADE;
CREATE TABLE location_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) NOT NULL,
  geofence_id UUID REFERENCES geofences(id),
  event_type VARCHAR(50) NOT NULL, -- 'entered', 'exited'
  location JSONB NOT NULL,
  event_time TIMESTAMPTZ DEFAULT NOW(),
  job_id UUID REFERENCES jobs(id)
);

CREATE INDEX idx_location_events_employee ON location_events(employee_id);
CREATE INDEX idx_location_events_geofence ON location_events(geofence_id);
CREATE INDEX idx_location_events_time ON location_events(event_time);

-- Fleet Vehicles
DROP TABLE IF EXISTS fleet_vehicles CASCADE;
CREATE TABLE fleet_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_number VARCHAR(100) UNIQUE NOT NULL,
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  vin VARCHAR(50),
  license_plate VARCHAR(50),
  mileage INTEGER,
  last_service_date DATE,
  next_service_date DATE,
  assigned_employee_id UUID REFERENCES employees(id),
  status VARCHAR(50) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fleet_vehicles_assigned ON fleet_vehicles(assigned_employee_id);
CREATE INDEX idx_fleet_vehicles_status ON fleet_vehicles(status);

-- Collaboration Sessions
DROP TABLE IF EXISTS collaboration_sessions CASCADE;
CREATE TABLE collaboration_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  participants UUID[] DEFAULT '{}',
  host_id UUID REFERENCES profiles(id),
  status VARCHAR(50) DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX idx_collab_sessions_entity ON collaboration_sessions(entity_type, entity_id);

-- Activity Logs (for collaboration)
DROP TABLE IF EXISTS activity_logs CASCADE;
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES profiles(id),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- Team Comments
DROP TABLE IF EXISTS team_comments CASCADE;
CREATE TABLE team_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  comment TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  parent_comment_id UUID REFERENCES team_comments(id),
  mentions UUID[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_comments_entity ON team_comments(entity_type, entity_id);
CREATE INDEX idx_team_comments_author ON team_comments(author_id);
CREATE INDEX idx_team_comments_parent ON team_comments(parent_comment_id);

-- User Presence
DROP TABLE IF EXISTS user_presence CASCADE;
CREATE TABLE user_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'offline', -- 'online', 'away', 'busy', 'offline'
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  current_page VARCHAR(500),
  is_mobile BOOLEAN DEFAULT false
);

CREATE INDEX idx_user_presence_user ON user_presence(user_id);
CREATE INDEX idx_user_presence_status ON user_presence(status);

-- Task Assignments
DROP TABLE IF EXISTS task_assignments CASCADE;
CREATE TABLE task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name VARCHAR(500) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES employees(id),
  assigned_by UUID REFERENCES employees(id),
  priority VARCHAR(50) DEFAULT 'normal',
  status VARCHAR(50) DEFAULT 'pending',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  entity_type VARCHAR(100),
  entity_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_assignments_assigned_to ON task_assignments(assigned_to);
CREATE INDEX idx_task_assignments_status ON task_assignments(status);
CREATE INDEX idx_task_assignments_entity ON task_assignments(entity_type, entity_id);

-- Followups
DROP TABLE IF EXISTS followups CASCADE;
CREATE TABLE followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) NOT NULL,
  job_id UUID REFERENCES jobs(id),
  followup_type VARCHAR(100) NOT NULL,
  scheduled_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  assigned_to UUID REFERENCES employees(id),
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_followups_customer ON followups(customer_id);
CREATE INDEX idx_followups_scheduled ON followups(scheduled_date);
CREATE INDEX idx_followups_status ON followups(status);

-- Inventory (alternate name used in some parts of code)
-- This is just a view or alias - actual table is inventory_items
CREATE VIEW inventory AS SELECT * FROM inventory_items;

-- RLS for misc tables
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_pricing_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurequick_equipment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE geofences ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;

-- Generic policies for most tables
DROP POLICY IF EXISTS "Documents viewable by authenticated" ON documents;
CREATE POLICY "Documents viewable by authenticated" ON documents FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Route history viewable by employee or managers" ON route_history;
CREATE POLICY "Route history viewable by employee or managers" ON route_history FOR SELECT TO authenticated USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);
DROP POLICY IF EXISTS "Marketing viewable by managers" ON marketing_campaigns;
CREATE POLICY "Marketing viewable by managers" ON marketing_campaigns FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);
DROP POLICY IF EXISTS "Diagnostic suggestions viewable by authenticated" ON diagnostic_pricing_suggestions;
CREATE POLICY "Diagnostic suggestions viewable by authenticated" ON diagnostic_pricing_suggestions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "MeasureQuick data viewable by authenticated" ON measurequick_equipment_data;
CREATE POLICY "MeasureQuick data viewable by authenticated" ON measurequick_equipment_data FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Geofences viewable by authenticated" ON geofences;
CREATE POLICY "Geofences viewable by authenticated" ON geofences FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Location events viewable by managers" ON location_events;
CREATE POLICY "Location events viewable by managers" ON location_events FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);
DROP POLICY IF EXISTS "Fleet viewable by authenticated" ON fleet_vehicles;
CREATE POLICY "Fleet viewable by authenticated" ON fleet_vehicles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Fleet manageable by managers" ON fleet_vehicles;
CREATE POLICY "Fleet manageable by managers" ON fleet_vehicles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);
DROP POLICY IF EXISTS "Collaboration viewable by participants" ON collaboration_sessions;
CREATE POLICY "Collaboration viewable by participants" ON collaboration_sessions FOR SELECT TO authenticated USING (
  auth.uid() = ANY(participants::UUID[])
);
DROP POLICY IF EXISTS "Activity logs viewable by authenticated" ON activity_logs;
CREATE POLICY "Activity logs viewable by authenticated" ON activity_logs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Team comments viewable by authenticated" ON team_comments;
CREATE POLICY "Team comments viewable by authenticated" ON team_comments FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Team comments insertable by authenticated" ON team_comments;
CREATE POLICY "Team comments insertable by authenticated" ON team_comments FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "User presence viewable by authenticated" ON user_presence;
CREATE POLICY "User presence viewable by authenticated" ON user_presence FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "User presence updatable by self" ON user_presence;
CREATE POLICY "User presence updatable by self" ON user_presence FOR ALL TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Task assignments viewable by assigned" ON task_assignments;
CREATE POLICY "Task assignments viewable by assigned" ON task_assignments FOR SELECT TO authenticated USING (
  assigned_to IN (SELECT id FROM employees WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager'))
);
DROP POLICY IF EXISTS "Followups viewable by authenticated" ON followups;
CREATE POLICY "Followups viewable by authenticated" ON followups FOR SELECT TO authenticated USING (true);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE tool_assignments_tracking IS 'Current tool assignments to employees or locations';
COMMENT ON TABLE tool_assignment_history IS 'Historical log of all tool movements';
COMMENT ON TABLE system_settings IS 'Application-wide configuration settings';
COMMENT ON TABLE workflow_automations IS 'Automated workflow definitions';
COMMENT ON TABLE automation_logs IS 'Execution logs for automations';
COMMENT ON TABLE workflow_executions IS 'Active workflow execution tracking';
COMMENT ON TABLE notifications IS 'In-app notifications for users';
COMMENT ON TABLE notification_queue IS 'Outbound notification queue for email/SMS';
COMMENT ON TABLE notification_preferences IS 'User notification preferences';
COMMENT ON TABLE notification_logs IS 'Historical log of sent notifications';
COMMENT ON TABLE customer_portal_tokens IS 'Access tokens for customer portal';
COMMENT ON TABLE payments IS 'Payment records for invoices';
COMMENT ON TABLE business_metrics IS 'Business intelligence metrics';
COMMENT ON TABLE audit_logs IS 'System-wide audit trail';
COMMENT ON TABLE documents IS 'Generic document/file storage';
COMMENT ON TABLE route_history IS 'Historical route data for technicians';
COMMENT ON TABLE route_optimizations IS 'Planned optimized routes';
COMMENT ON TABLE marketing_campaigns IS 'Marketing campaign tracking';
COMMENT ON TABLE diagnostic_pricing_suggestions IS 'AI-generated pricing suggestions from diagnostics';
COMMENT ON TABLE measurequick_equipment_data IS 'Equipment data from MeasureQuick integration';
COMMENT ON TABLE geofences IS 'Geographic boundaries for location-based triggers';
COMMENT ON TABLE location_events IS 'Geofence entry/exit events';
COMMENT ON TABLE fleet_vehicles IS 'Company vehicle fleet management';
COMMENT ON TABLE collaboration_sessions IS 'Real-time collaboration sessions';
COMMENT ON TABLE activity_logs IS 'User activity tracking for collaboration';
COMMENT ON TABLE team_comments IS 'Team comments on entities';
COMMENT ON TABLE user_presence IS 'Real-time user presence status';
COMMENT ON TABLE task_assignments IS 'Task management and assignments';
COMMENT ON TABLE followups IS 'Customer followup reminders';

-- =====================================================
-- END OF PHASE 4 MIGRATION
-- =====================================================
