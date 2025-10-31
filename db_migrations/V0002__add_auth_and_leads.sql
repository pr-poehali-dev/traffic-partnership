ALTER TABLE partners ADD COLUMN password_hash VARCHAR(255);
ALTER TABLE partners ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE partners ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL REFERENCES partners(id),
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    client_email VARCHAR(255),
    project_address TEXT,
    estimate_amount DECIMAL(12, 2),
    status VARCHAR(50) DEFAULT 'new',
    commission_amount DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_partner_id ON leads(partner_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);