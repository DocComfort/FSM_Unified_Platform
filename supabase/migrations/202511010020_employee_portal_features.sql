-- Migration: Employee Portal Features
-- Description: Add tables for benefits, expenses, certifications, and training documents
-- Date: October 18, 2025

-- ============================================================================
-- EMPLOYEE BENEFITS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS employee_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  benefit_type VARCHAR(100) NOT NULL, -- 'health_insurance', 'dental', 'vision', '401k', 'pto', 'sick_leave', etc.
  benefit_name VARCHAR(200) NOT NULL,
  provider VARCHAR(200),
  policy_number VARCHAR(100),
  coverage_level VARCHAR(50), -- 'employee_only', 'employee_spouse', 'family', etc.
  premium_amount DECIMAL(10,2),
  employer_contribution DECIMAL(10,2),
  employee_contribution DECIMAL(10,2),
  deduction_frequency VARCHAR(50), -- 'weekly', 'biweekly', 'monthly', etc.
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'pending', 'terminated', 'cancelled'
  beneficiaries JSONB DEFAULT '[]'::jsonb,
  documents JSONB DEFAULT '[]'::jsonb, -- Array of document URLs/references
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employee_benefits_employee ON employee_benefits(employee_id);
CREATE INDEX idx_employee_benefits_type ON employee_benefits(benefit_type);
CREATE INDEX idx_employee_benefits_status ON employee_benefits(status);

-- ============================================================================
-- EXPENSE REIMBURSEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS expense_reimbursements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  expense_date DATE NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'mileage', 'meals', 'supplies', 'tools', 'training', 'other'
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  receipt_url TEXT, -- URL to uploaded receipt image
  receipt_filename VARCHAR(255),
  job_id UUID REFERENCES jobs(id), -- Optional: link to specific job
  mileage_start VARCHAR(255),
  mileage_end VARCHAR(255),
  miles_driven DECIMAL(10,2),
  mileage_rate DECIMAL(10,4), -- Rate per mile (e.g., 0.655 for IRS 2023 rate)
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'denied', 'paid'
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMPTZ,
  denial_reason TEXT,
  payment_date DATE,
  payment_method VARCHAR(50), -- 'direct_deposit', 'check', 'payroll', etc.
  payment_reference VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expense_reimbursements_employee ON expense_reimbursements(employee_id);
CREATE INDEX idx_expense_reimbursements_status ON expense_reimbursements(status);
CREATE INDEX idx_expense_reimbursements_date ON expense_reimbursements(expense_date);
CREATE INDEX idx_expense_reimbursements_category ON expense_reimbursements(category);

-- ============================================================================
-- EMPLOYEE CERTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS employee_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  certification_name VARCHAR(200) NOT NULL,
  certification_number VARCHAR(100),
  issuing_organization VARCHAR(200) NOT NULL,
  issue_date DATE NOT NULL,
  expiration_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'suspended', 'revoked'
  category VARCHAR(100), -- 'hvac', 'epa', 'electrical', 'safety', 'management', etc.
  level VARCHAR(50), -- 'basic', 'intermediate', 'advanced', 'master', etc.
  document_url TEXT, -- URL to certification document/image
  document_filename VARCHAR(255),
  verification_url TEXT, -- URL to verify certification online
  continuing_education_required BOOLEAN DEFAULT false,
  ce_hours_required INTEGER,
  ce_hours_completed INTEGER DEFAULT 0,
  reminder_sent_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employee_certifications_employee ON employee_certifications(employee_id);
CREATE INDEX idx_employee_certifications_status ON employee_certifications(status);
CREATE INDEX idx_employee_certifications_expiration ON employee_certifications(expiration_date);
CREATE INDEX idx_employee_certifications_category ON employee_certifications(category);

-- ============================================================================
-- EMPLOYEE TRAINING DOCUMENTS TABLE  
-- ============================================================================
CREATE TABLE IF NOT EXISTS employee_training_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  document_type VARCHAR(100) NOT NULL, -- 'sop', 'manual', 'policy', 'safety', 'training_video', 'quiz', etc.
  category VARCHAR(100), -- 'safety', 'technical', 'customer_service', 'compliance', etc.
  document_url TEXT NOT NULL, -- URL to document (PDF, video, etc.)
  document_filename VARCHAR(255),
  file_size INTEGER, -- In bytes
  mime_type VARCHAR(100),
  version VARCHAR(50) DEFAULT '1.0',
  is_mandatory BOOLEAN DEFAULT false,
  applicable_roles TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of role names this applies to
  applicable_departments TEXT[] DEFAULT ARRAY[]::TEXT[],
  quiz_required BOOLEAN DEFAULT false,
  quiz_passing_score INTEGER, -- Percentage required to pass (e.g., 80)
  acknowledgment_required BOOLEAN DEFAULT false,
  expiration_days INTEGER, -- Days until training expires (null = never expires)
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived', 'draft'
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_training_docs_type ON employee_training_documents(document_type);
CREATE INDEX idx_training_docs_category ON employee_training_documents(category);
CREATE INDEX idx_training_docs_status ON employee_training_documents(status);
CREATE INDEX idx_training_docs_mandatory ON employee_training_documents(is_mandatory);

-- ============================================================================
-- EMPLOYEE TRAINING PROGRESS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS employee_training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  training_document_id UUID NOT NULL REFERENCES employee_training_documents(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'expired'
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  quiz_score INTEGER, -- Percentage score if quiz was taken
  quiz_attempts INTEGER DEFAULT 0,
  quiz_passed BOOLEAN,
  time_spent_minutes INTEGER, -- Total time spent on training
  acknowledged_at TIMESTAMPTZ, -- When employee acknowledged reading/understanding
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, training_document_id)
);

CREATE INDEX idx_training_progress_employee ON employee_training_progress(employee_id);
CREATE INDEX idx_training_progress_document ON employee_training_progress(training_document_id);
CREATE INDEX idx_training_progress_status ON employee_training_progress(status);
CREATE INDEX idx_training_progress_expires ON employee_training_progress(expires_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Employee Benefits RLS
ALTER TABLE employee_benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view their own benefits"
  ON employee_benefits FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

-- Expense Reimbursements RLS
ALTER TABLE expense_reimbursements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view their own expenses"
  ON expense_reimbursements FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager', 'accounting')
    )
  );

CREATE POLICY "Employees can submit expenses"
  ON expense_reimbursements FOR INSERT
  TO authenticated
  WITH CHECK (
    employee_id IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Employees can update pending expenses"
  ON expense_reimbursements FOR UPDATE
  TO authenticated
  USING (
    (employee_id IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    ) AND status = 'pending')
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager', 'accounting')
    )
  );

-- Employee Certifications RLS
ALTER TABLE employee_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view their own certifications"
  ON employee_certifications FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Employees can add their own certifications"
  ON employee_certifications FOR INSERT
  TO authenticated
  WITH CHECK (
    employee_id IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Employees can update their own certifications"
  ON employee_certifications FOR UPDATE
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

-- Training Documents RLS
ALTER TABLE employee_training_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view active training documents"
  ON employee_training_documents FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Admins and managers can manage training documents"
  ON employee_training_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

-- Training Progress RLS
ALTER TABLE employee_training_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view their own training progress"
  ON employee_training_progress FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Employees can update their own training progress"
  ON employee_training_progress FOR ALL
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
  );

-- ============================================================================
-- HELPFUL VIEWS
-- ============================================================================

-- View: Active employee benefits summary
CREATE OR REPLACE VIEW employee_benefits_summary AS
SELECT 
  e.id AS employee_id,
  e.employee_number,
  e.first_name,
  e.last_name,
  eb.benefit_type,
  eb.benefit_name,
  eb.status,
  eb.employee_contribution,
  eb.start_date,
  eb.end_date
FROM employees e
LEFT JOIN employee_benefits eb ON e.id = eb.employee_id
WHERE eb.status = 'active' OR eb.id IS NULL;

-- View: Pending expense reimbursements
CREATE OR REPLACE VIEW pending_expense_reimbursements AS
SELECT 
  er.*,
  e.employee_number,
  e.first_name,
  e.last_name,
  e.department
FROM expense_reimbursements er
JOIN employees e ON er.employee_id = e.id
WHERE er.status = 'pending'
ORDER BY er.submitted_at ASC;

-- View: Expiring certifications (within 90 days)
CREATE OR REPLACE VIEW expiring_certifications AS
SELECT 
  ec.*,
  e.employee_number,
  e.first_name,
  e.last_name,
  e.department,
  (ec.expiration_date - CURRENT_DATE) AS days_until_expiration
FROM employee_certifications ec
JOIN employees e ON ec.employee_id = e.id
WHERE ec.status = 'active'
  AND ec.expiration_date IS NOT NULL
  AND ec.expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days'
ORDER BY ec.expiration_date ASC;

-- View: Mandatory training compliance
CREATE OR REPLACE VIEW mandatory_training_compliance AS
SELECT 
  e.id AS employee_id,
  e.employee_number,
  e.first_name,
  e.last_name,
  e.role,
  e.department,
  etd.id AS training_id,
  etd.title AS training_title,
  etd.category,
  COALESCE(etp.status, 'not_started') AS completion_status,
  etp.completed_at,
  etp.expires_at
FROM employees e
CROSS JOIN employee_training_documents etd
LEFT JOIN employee_training_progress etp ON e.id = etp.employee_id AND etd.id = etp.training_document_id
WHERE etd.is_mandatory = true
  AND etd.status = 'active'
  AND (
    etd.applicable_roles = ARRAY[]::TEXT[]
    OR e.role = ANY(etd.applicable_roles)
  )
  AND (
    etd.applicable_departments = ARRAY[]::TEXT[]
    OR e.department = ANY(etd.applicable_departments)
  );

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_employee_benefits_updated_at
  BEFORE UPDATE ON employee_benefits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expense_reimbursements_updated_at
  BEFORE UPDATE ON expense_reimbursements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_certifications_updated_at
  BEFORE UPDATE ON employee_certifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_documents_updated_at
  BEFORE UPDATE ON employee_training_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_progress_updated_at
  BEFORE UPDATE ON employee_training_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

COMMENT ON TABLE employee_benefits IS 'Stores employee benefits information including health insurance, retirement plans, PTO balances, etc.';
COMMENT ON TABLE expense_reimbursements IS 'Tracks employee expense submissions and reimbursement requests with receipt uploads';
COMMENT ON TABLE employee_certifications IS 'Manages employee professional certifications, licenses, and credentials';
COMMENT ON TABLE employee_training_documents IS 'Library of training materials, SOPs, manuals, and required reading';
COMMENT ON TABLE employee_training_progress IS 'Tracks individual employee progress through training programs';
