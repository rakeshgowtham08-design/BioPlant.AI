-- ==============================================================================
-- BioPlant.AI - Supabase PostgreSQL Schema Extension
-- B2B Crop Marketplace, Cargo Escrow Transfers & Customer CRM Records
-- ==============================================================================

-- 1. Create table: customer_records
CREATE TABLE IF NOT EXISTS customer_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    crop_type TEXT NOT NULL,
    active_contracts_count INT DEFAULT 1,
    total_volume_mt NUMERIC(10, 2) DEFAULT 0.0,
    total_revenue NUMERIC(12, 2) DEFAULT 0.0,
    status TEXT DEFAULT 'Active Off-taker',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create table: marketplace_deals
CREATE TABLE IF NOT EXISTS marketplace_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    crop_type TEXT NOT NULL,
    price_per_ton NUMERIC(10, 2) NOT NULL,
    quantity_sold NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    transaction_status TEXT NOT NULL DEFAULT 'Pending Dispatch',
    contract_hash TEXT NOT NULL,
    fulfillment_percent INT DEFAULT 0,
    customer_id UUID REFERENCES customer_records(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_buyer_name ON marketplace_deals(buyer_name);
CREATE INDEX IF NOT EXISTS idx_deals_crop_type ON marketplace_deals(crop_type);
CREATE INDEX IF NOT EXISTS idx_deals_status ON marketplace_deals(transaction_status);
CREATE INDEX IF NOT EXISTS idx_customers_company ON customer_records(company_name);

-- Row Level Security (RLS) policies
ALTER TABLE customer_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_deals ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated and anonymous users for demo
CREATE POLICY "Public read customer_records" ON customer_records FOR SELECT USING (true);
CREATE POLICY "Public insert customer_records" ON customer_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update customer_records" ON customer_records FOR UPDATE USING (true);

CREATE POLICY "Public read marketplace_deals" ON marketplace_deals FOR SELECT USING (true);
CREATE POLICY "Public insert marketplace_deals" ON marketplace_deals FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update marketplace_deals" ON marketplace_deals FOR UPDATE USING (true);

-- Seed Initial Verified Off-Takers & Commercial Deals
INSERT INTO customer_records (id, company_name, contact_person, email, phone, crop_type, active_contracts_count, total_volume_mt, total_revenue, status, created_at)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'AgroCorp International', 'Henrik Lindqvist', 'h.lindqvist@agrocorp-trade.com', '+41 22 819 4000', 'Rice', 3, 4200.0, 1302000.0, 'Active Off-taker', NOW() - INTERVAL '14 days'),
    ('b2222222-2222-2222-2222-222222222222', 'Delta Millers & Grain Ltd', 'Anand K. Sharma', 'procurement@deltamillers.in', '+91 80 4112 9081', 'Rice', 2, 1800.0, 576000.0, 'Active Off-taker', NOW() - INTERVAL '7 days'),
    ('c3333333-3333-3333-3333-333333333333', 'Global Grains Consortium AG', 'Claire Delacroix', 'trade@globalgrains-ag.ch', '+41 44 298 1120', 'Wheat', 2, 3100.0, 899000.0, 'Verified Partner', NOW() - INTERVAL '21 days'),
    ('d4444444-4444-4444-4444-444444444444', 'Pacific Harvest Fiber Co.', 'David Chen', 'supply@pacificharvest.sg', '+65 6720 8911', 'Cotton', 1, 950.0, 589000.0, 'Active Off-taker', NOW() - INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO marketplace_deals (id, field_id, buyer_name, crop_type, price_per_ton, quantity_sold, total_amount, transaction_status, contract_hash, fulfillment_percent, customer_id, created_at)
VALUES
    ('d1111111-1111-1111-1111-111111111111', 'field-01', 'AgroCorp International', 'Rice', 310.00, 1500.0, 465000.00, 'Paid', '0x8f21e4a189c42b91024e81cb8017cba4', 100, 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '12 days'),
    ('d2222222-2222-2222-2222-222222222222', 'field-02', 'Delta Millers & Grain Ltd', 'Rice', 320.00, 800.0, 256000.00, 'In Escrow', '0x7e14d9b012c8a7413f9901ad47a321be', 75, 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '5 days'),
    ('d3333333-3333-3333-3333-333333333333', 'field-01', 'AgroCorp International', 'Rice', 310.00, 1200.0, 372000.00, 'Dispatched', '0x3a90fb4510cd298a87ec224419ad08fe', 45, 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days'),
    ('d4444444-4444-4444-4444-444444444444', 'field-03', 'Global Grains Consortium AG', 'Wheat', 290.00, 1000.0, 290000.00, 'Pending Dispatch', '0x5b7612efc4019a338cd910ea521cb730', 0, 'c3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

