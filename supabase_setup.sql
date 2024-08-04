-- Create user_table
CREATE TABLE user_table (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_upd TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    user_type TEXT NOT NULL,
    user_org TEXT NOT NULL,
    created_by TEXT,
    last_upd_by TEXT,
    application_name TEXT[]
);

-- Create user_org table
CREATE TABLE user_org (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_upd TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_upd_by TEXT NOT NULL,
    org_name TEXT NOT NULL
);

-- Create dsr_tracker table
CREATE TABLE dsr_tracker (
    id BIGSERIAL PRIMARY KEY,
    created_dt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    po_number TEXT NOT NULL,
    last_upd_dt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_upd_by TEXT NOT NULL,
    created_by TEXT NOT NULL,
    comments JSONB NOT NULL,
    user_org TEXT NOT NULL
);

-- Create enquiry table
CREATE TABLE enquiry (
    id SERIAL PRIMARY KEY,
    sno INTEGER NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_date DATE NOT NULL,
    enquiry_id VARCHAR(255),
    channel VARCHAR(255) NOT NULL,
    enquiry_mode VARCHAR(255) NOT NULL,
    enquiry_type VARCHAR(255) NOT NULL,
    enquiry_subtype VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    inco_terms VARCHAR(255) NOT NULL,
    origin_country VARCHAR(255) NOT NULL,
    origin_port VARCHAR(255) NOT NULL,
    destination_country VARCHAR(255) NOT NULL,
    destination_port VARCHAR(255) NOT NULL,
    length INTEGER NOT NULL,
    breadth INTEGER NOT NULL,
    height INTEGER NOT NULL,
    unit_of_measurement VARCHAR(255) NOT NULL,
    package_type VARCHAR(255) NOT NULL,
    no_of_pkgs INTEGER NOT NULL,
    net_weight INTEGER,
    total_net INTEGER,
    gross_weight INTEGER NOT NULL,
    total_gross INTEGER,
    equipment VARCHAR(255) NOT NULL,
    no_of_units INTEGER,
    commodity VARCHAR(255) NOT NULL,
    cargo_readiness DATE,
    cut_off_eta DATE,
    indication_in_usd VARCHAR(255),
    remarks VARCHAR(255),
    is_assigned BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    updated_by VARCHAR(255) NOT NULL,
    updated_date DATE NOT NULL
);

-- Create saved_search_enquiry table
CREATE TABLE saved_search_enquiry (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    criteria JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL,
    application_name TEXT NOT NULL
);

-- Insert a test user
INSERT INTO user_table (user_id, password, user_type, user_org, created_by, last_upd_by, application_name)
VALUES ('test@example.com', 'password123', 'admin', 'Test Org', 'system', 'system', ARRAY['Enquiry']);
