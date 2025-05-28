-- Texas Restaurant Tax Scanner Database Schema
-- Comprehensive database for managing tax information across states, counties, and cities

-- States table
CREATE TABLE states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(2) NOT NULL UNIQUE, -- TX, CA, NY, etc.
    name VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Counties table
CREATE TABLE counties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL, -- harris, dallas, etc.
    fips_code VARCHAR(5), -- Federal Information Processing Standards code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id),
    UNIQUE(state_id, slug)
);

-- Cities table
CREATE TABLE cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    county_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    population INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (county_id) REFERENCES counties(id),
    UNIQUE(county_id, slug)
);

-- Tax types table (state, county, city, special district, etc.)
CREATE TABLE tax_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE, -- state, county, city, special, transit, etc.
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tax authorities table (who collects the tax)
CREATE TABLE tax_authorities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    type_id INTEGER NOT NULL,
    state_id INTEGER,
    county_id INTEGER,
    city_id INTEGER,
    website VARCHAR(500),
    contact_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES tax_types(id),
    FOREIGN KEY (state_id) REFERENCES states(id),
    FOREIGN KEY (county_id) REFERENCES counties(id),
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Tax data versions (for tracking updates)
CREATE TABLE tax_data_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version_number VARCHAR(20) NOT NULL,
    state_id INTEGER NOT NULL,
    source_url VARCHAR(500),
    source_date DATE, -- When the source data was published
    imported_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imported_by VARCHAR(100),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (state_id) REFERENCES states(id)
);

-- Main taxes table
CREATE TABLE taxes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version_id INTEGER NOT NULL,
    authority_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    rate DECIMAL(10,4) NOT NULL, -- 6.25 for 6.25% or 0.05 for $0.05
    is_percentage BOOLEAN NOT NULL DEFAULT TRUE,
    applies_to TEXT, -- What this tax applies to
    description TEXT,
    effective_date DATE,
    expiration_date DATE,
    minimum_amount DECIMAL(10,2),
    maximum_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (version_id) REFERENCES tax_data_versions(id),
    FOREIGN KEY (authority_id) REFERENCES tax_authorities(id)
);

-- Tax jurisdictions (which areas each tax applies to)
CREATE TABLE tax_jurisdictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tax_id INTEGER NOT NULL,
    state_id INTEGER,
    county_id INTEGER,
    city_id INTEGER,
    zip_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tax_id) REFERENCES taxes(id),
    FOREIGN KEY (state_id) REFERENCES states(id),
    FOREIGN KEY (county_id) REFERENCES counties(id),
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Data sources table (for tracking where tax info comes from)
CREATE TABLE data_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    url VARCHAR(500),
    api_endpoint VARCHAR(500),
    update_frequency VARCHAR(50), -- daily, weekly, monthly, quarterly
    last_checked TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update logs table (for tracking all data updates)
CREATE TABLE update_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER,
    version_id INTEGER,
    update_type VARCHAR(50), -- manual, automatic, api
    records_updated INTEGER DEFAULT 0,
    records_added INTEGER DEFAULT 0,
    records_deleted INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (source_id) REFERENCES data_sources(id),
    FOREIGN KEY (version_id) REFERENCES tax_data_versions(id)
);

-- Indexes for better performance
CREATE INDEX idx_counties_state_slug ON counties(state_id, slug);
CREATE INDEX idx_cities_county_slug ON cities(county_id, slug);
CREATE INDEX idx_taxes_version_authority ON taxes(version_id, authority_id);
CREATE INDEX idx_tax_jurisdictions_location ON tax_jurisdictions(state_id, county_id, city_id);
CREATE INDEX idx_tax_data_versions_active ON tax_data_versions(state_id, is_active);

-- Insert initial data for Texas
INSERT INTO states (code, name, full_name) VALUES ('TX', 'Texas', 'State of Texas');

INSERT INTO tax_types (name, description) VALUES 
    ('state', 'State-level sales tax'),
    ('county', 'County-level sales tax'),
    ('city', 'City/municipal sales tax'),
    ('special', 'Special district tax (transit, etc.)'),
    ('fee', 'Fixed fees (bag fees, etc.)');

-- Insert initial data source
INSERT INTO data_sources (name, url, update_frequency) VALUES 
    ('Texas Comptroller Sales Tax Rates', 'https://comptroller.texas.gov/taxes/sales/', 'quarterly'),
    ('Manual Entry', NULL, 'as_needed'); 