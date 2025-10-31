-- =====================================================
-- Phase 3: Extended Features Migration  
-- =====================================================
-- Created: 2025-10-13
-- Purpose: Add time tracking, communications, maintenance,
--          and service agreement tables
-- Priority: MEDIUM - Fixes 50+ errors, enables advanced features
-- =====================================================

-- =====================================================
-- 1. TIME ENTRIES TABLE
-- =====================================================
-- Manual time entry for jobs and tasks

DROP TABLE IF EXISTS time_entries CASCADE;
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Employee & Job
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id),
  
  -- Time Details
  entry_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  duration_minutes INTEGER, -- Calculated or manual
  
  -- Break Time
  break_minutes INTEGER DEFAULT 0,
  billable_minutes INTEGER, -- duration_minutes - break_minutes
  
  -- Type & Status
  entry_type VARCHAR(50) DEFAULT 'regular', -- 'regular', 'overtime', 'double_time', 'vacation', 'sick', 'holiday'
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'approved', 'rejected', 'invoiced'
  
  -- Billing
  hourly_rate DECIMAL(10, 2),
  billable_amount DECIMAL(10, 2),
  is_billable BOOLEAN DEFAULT true,
  
  -- Details
  description TEXT,
  notes TEXT,
  work_performed TEXT,
  
  -- Approval
  submitted_at TIMESTAMPTZ,
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Indexes for time_entries
CREATE INDEX idx_time_entries_employee ON time_entries(employee_id);
CREATE INDEX idx_time_entries_job ON time_entries(job_id);
CREATE INDEX idx_time_entries_date ON time_entries(entry_date);
CREATE INDEX idx_time_entries_status ON time_entries(status);

-- RLS for time_entries
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Time entries viewable by employee or managers" ON time_entries;
CREATE POLICY "Time entries viewable by employee or managers" ON time_entries
  FOR SELECT TO authenticated USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

DROP POLICY IF EXISTS "Time entries manageable by employee" ON time_entries;
CREATE POLICY "Time entries manageable by employee" ON time_entries
  FOR ALL TO authenticated USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );


-- =====================================================
-- 2. TIME CLOCK ENTRIES TABLE
-- =====================================================
-- Clock in/out tracking (real-time punch clock)

DROP TABLE IF EXISTS time_clock_entries CASCADE;
CREATE TABLE time_clock_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Employee
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  
  -- Clock Times
  clock_in_time TIMESTAMPTZ NOT NULL,
  clock_out_time TIMESTAMPTZ,
  
  -- Location Tracking
  clock_in_location JSONB,
  clock_out_location JSONB,
  clock_in_address TEXT,
  clock_out_address TEXT,
  clock_in_method VARCHAR(50) DEFAULT 'manual', -- 'manual', 'mobile', 'web', 'biometric'
  clock_out_method VARCHAR(50),
  
  -- Job Association
  job_id UUID REFERENCES jobs(id),
  
  -- Duration
  duration_minutes INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (clock_out_time - clock_in_time)) / 60
  ) STORED,
  
  -- Break Tracking
  break_minutes INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'missed_out', 'edited'
  
  -- Notes
  notes TEXT,
  clock_in_notes TEXT,
  clock_out_notes TEXT,
  
  -- Exceptions
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  edited_by UUID REFERENCES employees(id),
  edited_at TIMESTAMPTZ,
  edit_reason TEXT
);

-- Indexes for time_clock_entries
CREATE INDEX idx_time_clock_employee ON time_clock_entries(employee_id);
CREATE INDEX idx_time_clock_in_time ON time_clock_entries(clock_in_time);
CREATE INDEX idx_time_clock_status ON time_clock_entries(status);
CREATE INDEX idx_time_clock_job ON time_clock_entries(job_id);

-- RLS for time_clock_entries
ALTER TABLE time_clock_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clock entries viewable by employee or managers" ON time_clock_entries;
CREATE POLICY "Clock entries viewable by employee or managers" ON time_clock_entries
  FOR SELECT TO authenticated USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

DROP POLICY IF EXISTS "Clock entries manageable by employee" ON time_clock_entries;
CREATE POLICY "Clock entries manageable by employee" ON time_clock_entries
  FOR ALL TO authenticated USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );


-- =====================================================
-- 3. PAYROLL RECORDS TABLE
-- =====================================================
-- Payroll processing records

DROP TABLE IF EXISTS payroll_records CASCADE;
CREATE TABLE payroll_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Payroll Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  pay_date DATE NOT NULL,
  
  -- Employee
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  
  -- Hours
  regular_hours DECIMAL(10, 2) DEFAULT 0,
  overtime_hours DECIMAL(10, 2) DEFAULT 0,
  double_time_hours DECIMAL(10, 2) DEFAULT 0,
  pto_hours DECIMAL(10, 2) DEFAULT 0,
  sick_hours DECIMAL(10, 2) DEFAULT 0,
  holiday_hours DECIMAL(10, 2) DEFAULT 0,
  total_hours DECIMAL(10, 2) GENERATED ALWAYS AS (
    regular_hours + overtime_hours + double_time_hours + pto_hours + sick_hours + holiday_hours
  ) STORED,
  
  -- Rates
  regular_rate DECIMAL(10, 2) NOT NULL,
  overtime_rate DECIMAL(10, 2),
  double_time_rate DECIMAL(10, 2),
  
  -- Earnings
  regular_pay DECIMAL(10, 2) DEFAULT 0,
  overtime_pay DECIMAL(10, 2) DEFAULT 0,
  double_time_pay DECIMAL(10, 2) DEFAULT 0,
  pto_pay DECIMAL(10, 2) DEFAULT 0,
  sick_pay DECIMAL(10, 2) DEFAULT 0,
  holiday_pay DECIMAL(10, 2) DEFAULT 0,
  bonus DECIMAL(10, 2) DEFAULT 0,
  commission DECIMAL(10, 2) DEFAULT 0,
  reimbursements DECIMAL(10, 2) DEFAULT 0,
  gross_pay DECIMAL(10, 2) NOT NULL,
  
  -- Deductions
  federal_tax DECIMAL(10, 2) DEFAULT 0,
  state_tax DECIMAL(10, 2) DEFAULT 0,
  social_security DECIMAL(10, 2) DEFAULT 0,
  medicare DECIMAL(10, 2) DEFAULT 0,
  health_insurance DECIMAL(10, 2) DEFAULT 0,
  retirement_401k DECIMAL(10, 2) DEFAULT 0,
  other_deductions DECIMAL(10, 2) DEFAULT 0,
  total_deductions DECIMAL(10, 2) NOT NULL,
  
  -- Net Pay
  net_pay DECIMAL(10, 2) GENERATED ALWAYS AS (gross_pay - total_deductions) STORED,
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_approval', 'approved', 'processed', 'paid'
  
  -- Payment
  payment_method VARCHAR(50) DEFAULT 'direct_deposit',
  payment_reference VARCHAR(200),
  paid_date DATE,
  
  -- Processing
  processed_by UUID REFERENCES employees(id),
  processed_at TIMESTAMPTZ,
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMPTZ,
  
  -- Notes
  notes TEXT,
  adjustments JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for payroll_records
CREATE INDEX idx_payroll_employee ON payroll_records(employee_id);
CREATE INDEX idx_payroll_period ON payroll_records(period_start, period_end);
CREATE INDEX idx_payroll_status ON payroll_records(status);
CREATE INDEX idx_payroll_pay_date ON payroll_records(pay_date);

-- RLS for payroll_records
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Payroll viewable by employee or managers" ON payroll_records;
CREATE POLICY "Payroll viewable by employee or managers" ON payroll_records
  FOR SELECT TO authenticated USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

DROP POLICY IF EXISTS "Payroll manageable by managers only" ON payroll_records;
CREATE POLICY "Payroll manageable by managers only" ON payroll_records
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );


-- =====================================================
-- 4. TIME OFF REQUESTS TABLE
-- =====================================================
-- PTO, vacation, sick leave requests

DROP TABLE IF EXISTS time_off_requests CASCADE;
CREATE TABLE time_off_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Employee
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  
  -- Request Details
  request_type VARCHAR(50) NOT NULL, -- 'vacation', 'sick', 'personal', 'bereavement', 'jury_duty', 'unpaid'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days DECIMAL(5, 2) NOT NULL, -- Can be partial days (0.5)
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'denied', 'cancelled'
  
  -- Approval
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMPTZ,
  denial_reason TEXT,
  
  -- Details
  reason TEXT,
  notes TEXT,
  is_paid BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for time_off_requests
CREATE INDEX idx_time_off_employee ON time_off_requests(employee_id);
CREATE INDEX idx_time_off_dates ON time_off_requests(start_date, end_date);
CREATE INDEX idx_time_off_status ON time_off_requests(status);
CREATE INDEX idx_time_off_type ON time_off_requests(request_type);

-- RLS for time_off_requests
ALTER TABLE time_off_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Time off viewable by employee or managers" ON time_off_requests;
CREATE POLICY "Time off viewable by employee or managers" ON time_off_requests
  FOR SELECT TO authenticated USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

DROP POLICY IF EXISTS "Time off requestable by employee" ON time_off_requests;
CREATE POLICY "Time off requestable by employee" ON time_off_requests
  FOR INSERT TO authenticated WITH CHECK (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Time off approvable by managers" ON time_off_requests;
CREATE POLICY "Time off approvable by managers" ON time_off_requests
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );


-- =====================================================
-- 5. CUSTOMER COMMUNICATIONS TABLE
-- =====================================================
-- Log of all customer communications

DROP TABLE IF EXISTS customer_communications CASCADE;
CREATE TABLE customer_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer & Job
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id),
  
  -- Communication Details
  communication_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'phone', 'in_person', 'note'
  direction VARCHAR(50) NOT NULL, -- 'inbound', 'outbound'
  
  -- Content
  subject VARCHAR(500),
  body TEXT NOT NULL,
  
  -- Contact Info
  contact_method VARCHAR(200), -- Email address or phone number used
  
  -- Status
  status VARCHAR(50) DEFAULT 'sent', -- 'draft', 'sent', 'delivered', 'read', 'failed'
  
  -- Staff
  employee_id UUID REFERENCES employees(id),
  
  -- Attachments
  attachments JSONB DEFAULT '[]',
  
  -- External IDs
  email_message_id VARCHAR(500), -- For email threading
  sms_message_id VARCHAR(500),
  
  -- Timestamps
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Indexes for customer_communications
CREATE INDEX idx_customer_comms_customer ON customer_communications(customer_id);
CREATE INDEX idx_customer_comms_job ON customer_communications(job_id);
CREATE INDEX idx_customer_comms_type ON customer_communications(communication_type);
CREATE INDEX idx_customer_comms_created ON customer_communications(created_at);

-- RLS for customer_communications
ALTER TABLE customer_communications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customer comms viewable by authenticated users" ON customer_communications;
CREATE POLICY "Customer comms viewable by authenticated users" ON customer_communications
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Customer comms insertable by staff" ON customer_communications;
CREATE POLICY "Customer comms insertable by staff" ON customer_communications
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager', 'technician')
    )
  );


-- =====================================================
-- 6. COMMUNICATION THREADS TABLE
-- =====================================================
-- Threaded conversations (internal team chat)

DROP TABLE IF EXISTS communication_threads CASCADE;
CREATE TABLE communication_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Thread Details
  subject VARCHAR(500) NOT NULL,
  thread_type VARCHAR(50) DEFAULT 'general', -- 'general', 'job', 'customer', 'project', 'team'
  
  -- Context
  customer_id UUID REFERENCES customers(id),
  job_id UUID REFERENCES jobs(id),
  
  -- Participants
  participants UUID[] DEFAULT '{}', -- Array of employee IDs
  owner_id UUID REFERENCES employees(id),
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived', 'closed'
  is_pinned BOOLEAN DEFAULT false,
  priority VARCHAR(50) DEFAULT 'normal', -- 'low', 'normal', 'high'
  
  -- Metrics
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Indexes for communication_threads
CREATE INDEX idx_comm_threads_type ON communication_threads(thread_type);
CREATE INDEX idx_comm_threads_status ON communication_threads(status);
CREATE INDEX idx_comm_threads_customer ON communication_threads(customer_id);
CREATE INDEX idx_comm_threads_job ON communication_threads(job_id);
CREATE INDEX idx_comm_threads_last_message ON communication_threads(last_message_at);

-- RLS for communication_threads
ALTER TABLE communication_threads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Threads viewable by participants" ON communication_threads;
CREATE POLICY "Threads viewable by participants" ON communication_threads
  FOR SELECT TO authenticated USING (
    auth.uid() = ANY(participants::UUID[])
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

DROP POLICY IF EXISTS "Threads creatable by staff" ON communication_threads;
CREATE POLICY "Threads creatable by staff" ON communication_threads
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager', 'technician')
    )
  );


-- =====================================================
-- 7. COMMUNICATION MESSAGES TABLE
-- =====================================================
-- Individual messages within threads

DROP TABLE IF EXISTS communication_messages CASCADE;
CREATE TABLE communication_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Thread
  thread_id UUID REFERENCES communication_threads(id) ON DELETE CASCADE NOT NULL,
  
  -- Message Content
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'file', 'image', 'system'
  
  -- Author
  sender_id UUID REFERENCES employees(id) NOT NULL,
  
  -- Status
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  
  -- Attachments
  attachments JSONB DEFAULT '[]',
  
  -- Mentions & Reactions
  mentions UUID[] DEFAULT '{}', -- Array of employee IDs mentioned
  reactions JSONB DEFAULT '{}', -- { emoji: [employee_ids] }
  
  -- Read Receipts
  read_by UUID[] DEFAULT '{}', -- Array of employee IDs who read this
  
  -- Parent (for replies)
  parent_message_id UUID REFERENCES communication_messages(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for communication_messages
CREATE INDEX idx_comm_messages_thread ON communication_messages(thread_id);
CREATE INDEX idx_comm_messages_sender ON communication_messages(sender_id);
CREATE INDEX idx_comm_messages_created ON communication_messages(created_at);
CREATE INDEX idx_comm_messages_parent ON communication_messages(parent_message_id);

-- RLS for communication_messages
ALTER TABLE communication_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Messages viewable by thread participants" ON communication_messages;
CREATE POLICY "Messages viewable by thread participants" ON communication_messages
  FOR SELECT TO authenticated USING (
    thread_id IN (
      SELECT id FROM communication_threads 
      WHERE auth.uid() = ANY(participants::UUID[])
    )
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

DROP POLICY IF EXISTS "Messages insertable by staff" ON communication_messages;
CREATE POLICY "Messages insertable by staff" ON communication_messages
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager', 'technician')
    )
  );


-- =====================================================
-- 8. MAINTENANCE SCHEDULES TABLE
-- =====================================================
-- Recurring maintenance schedules for equipment

DROP TABLE IF EXISTS maintenance_schedules CASCADE;
CREATE TABLE maintenance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Equipment & Customer
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  
  -- Schedule Details
  schedule_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Frequency
  frequency VARCHAR(50) NOT NULL, -- 'monthly', 'quarterly', 'semi_annual', 'annual', 'custom'
  frequency_months INTEGER, -- For custom frequency
  
  -- Dates
  start_date DATE NOT NULL,
  next_service_date DATE NOT NULL,
  last_service_date DATE,
  
  -- Service Details
  service_type VARCHAR(100),
  estimated_duration INTEGER, -- minutes
  estimated_cost DECIMAL(10, 2),
  
  -- Assignment
  preferred_technician_id UUID REFERENCES employees(id),
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'cancelled', 'completed'
  is_active BOOLEAN DEFAULT true,
  
  -- Notifications
  send_reminder BOOLEAN DEFAULT true,
  reminder_days_before INTEGER DEFAULT 7,
  
  -- Contract
  service_agreement_id UUID, -- Will link to service_agreements table
  is_under_contract BOOLEAN DEFAULT false,
  
  -- Notes
  notes TEXT,
  special_instructions TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Indexes for maintenance_schedules
CREATE INDEX idx_maintenance_equipment ON maintenance_schedules(equipment_id);
CREATE INDEX idx_maintenance_customer ON maintenance_schedules(customer_id);
CREATE INDEX idx_maintenance_next_date ON maintenance_schedules(next_service_date);
CREATE INDEX idx_maintenance_status ON maintenance_schedules(status);
CREATE INDEX idx_maintenance_is_active ON maintenance_schedules(is_active);

-- RLS for maintenance_schedules
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Maintenance schedules viewable by authenticated users" ON maintenance_schedules;
CREATE POLICY "Maintenance schedules viewable by authenticated users" ON maintenance_schedules
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Maintenance schedules manageable by staff" ON maintenance_schedules;
CREATE POLICY "Maintenance schedules manageable by staff" ON maintenance_schedules
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );


-- =====================================================
-- 9. SERVICE AGREEMENTS TABLE
-- =====================================================
-- Service contracts and maintenance plans

DROP TABLE IF EXISTS service_agreements CASCADE;
CREATE TABLE service_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  
  -- Agreement Details
  agreement_number VARCHAR(100) UNIQUE NOT NULL,
  agreement_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Contract Period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  renewal_date DATE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'draft', 'active', 'expired', 'cancelled', 'renewed'
  
  -- Billing
  billing_frequency VARCHAR(50) NOT NULL, -- 'monthly', 'quarterly', 'annual', 'one_time'
  billing_amount DECIMAL(10, 2) NOT NULL,
  billing_day INTEGER, -- Day of month for billing
  next_billing_date DATE,
  
  -- Coverage
  coverage_type VARCHAR(100), -- 'preventive_only', 'repairs_included', 'full_coverage'
  covered_equipment UUID[], -- Array of equipment IDs
  
  -- Service Terms
  included_visits INTEGER DEFAULT 0, -- Number of visits included per period
  visits_used INTEGER DEFAULT 0,
  discount_percentage DECIMAL(5, 2) DEFAULT 0, -- Discount on additional services
  
  -- Response Time
  priority_response BOOLEAN DEFAULT false,
  guaranteed_response_hours INTEGER,
  
  -- Auto Renewal
  auto_renew BOOLEAN DEFAULT false,
  renewal_notice_days INTEGER DEFAULT 30,
  
  -- Contract Documents
  contract_document_url TEXT,
  signed_document_url TEXT,
  signed_date DATE,
  signed_by VARCHAR(200),
  
  -- Notes
  terms_and_conditions TEXT,
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES employees(id),
  cancellation_reason TEXT
);

-- Indexes for service_agreements
CREATE INDEX idx_service_agreements_customer ON service_agreements(customer_id);
CREATE INDEX idx_service_agreements_number ON service_agreements(agreement_number);
CREATE INDEX idx_service_agreements_status ON service_agreements(status);
CREATE INDEX idx_service_agreements_dates ON service_agreements(start_date, end_date);
CREATE INDEX idx_service_agreements_next_billing ON service_agreements(next_billing_date);

-- RLS for service_agreements
ALTER TABLE service_agreements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service agreements viewable by authenticated users" ON service_agreements;
CREATE POLICY "Service agreements viewable by authenticated users" ON service_agreements
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Service agreements manageable by managers" ON service_agreements;
CREATE POLICY "Service agreements manageable by managers" ON service_agreements
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );


-- =====================================================
-- 10. CUSTOMER REVIEWS TABLE
-- =====================================================
-- Customer feedback and ratings

DROP TABLE IF EXISTS customer_reviews CASCADE;
CREATE TABLE customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer & Job
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id),
  
  -- Ratings
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  
  -- Technician Rating
  technician_id UUID REFERENCES employees(id),
  technician_rating INTEGER CHECK (technician_rating >= 1 AND technician_rating <= 5),
  
  -- Feedback
  title VARCHAR(500),
  review_text TEXT,
  
  -- Recommendation
  would_recommend BOOLEAN,
  
  -- Source
  review_source VARCHAR(50) DEFAULT 'direct', -- 'direct', 'email', 'google', 'yelp', 'facebook'
  
  -- Status
  status VARCHAR(50) DEFAULT 'published', -- 'pending', 'published', 'flagged', 'hidden'
  is_featured BOOLEAN DEFAULT false,
  
  -- Response
  company_response TEXT,
  responded_by UUID REFERENCES employees(id),
  responded_at TIMESTAMPTZ,
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verified_purchase BOOLEAN DEFAULT true,
  
  -- External
  external_review_id VARCHAR(255),
  external_review_url TEXT,
  
  -- Metadata
  review_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for customer_reviews
CREATE INDEX idx_customer_reviews_customer ON customer_reviews(customer_id);
CREATE INDEX idx_customer_reviews_job ON customer_reviews(job_id);
CREATE INDEX idx_customer_reviews_technician ON customer_reviews(technician_id);
CREATE INDEX idx_customer_reviews_overall_rating ON customer_reviews(overall_rating);
CREATE INDEX idx_customer_reviews_status ON customer_reviews(status);
CREATE INDEX idx_customer_reviews_date ON customer_reviews(review_date);

-- RLS for customer_reviews
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews viewable by authenticated users" ON customer_reviews;
CREATE POLICY "Reviews viewable by authenticated users" ON customer_reviews
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Reviews manageable by managers" ON customer_reviews;
CREATE POLICY "Reviews manageable by managers" ON customer_reviews
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );


-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE time_entries IS 'Manual time entry for jobs and tasks';
COMMENT ON TABLE time_clock_entries IS 'Clock in/out tracking (punch clock)';
COMMENT ON TABLE payroll_records IS 'Payroll processing records per pay period';
COMMENT ON TABLE time_off_requests IS 'PTO, vacation, and leave requests';
COMMENT ON TABLE customer_communications IS 'Log of all customer communications';
COMMENT ON TABLE communication_threads IS 'Threaded conversations for internal team';
COMMENT ON TABLE communication_messages IS 'Individual messages within threads';
COMMENT ON TABLE maintenance_schedules IS 'Recurring maintenance schedules';
COMMENT ON TABLE service_agreements IS 'Service contracts and maintenance plans';
COMMENT ON TABLE customer_reviews IS 'Customer feedback and ratings';

-- =====================================================
-- END OF PHASE 3 MIGRATION
-- =====================================================
