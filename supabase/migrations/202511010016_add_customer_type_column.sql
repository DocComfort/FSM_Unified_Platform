-- Add customer_type column to customers table
-- This allows proper categorization of residential vs commercial customers

ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS customer_type TEXT DEFAULT 'residential' CHECK (customer_type IN ('residential', 'commercial'));

-- Add index for faster filtering by customer type
CREATE INDEX IF NOT EXISTS idx_customers_customer_type ON customers(customer_type);

-- Add comment for documentation
COMMENT ON COLUMN customers.customer_type IS 'Type of customer: residential or commercial';

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
