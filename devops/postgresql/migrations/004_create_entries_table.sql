-- Migration: Create Entries Table
-- Description: Creates the entries table for financial records

-- Create entries table
CREATE TABLE IF NOT EXISTS entries (
    id VARCHAR(26) PRIMARY KEY,
    date TIMESTAMP,
    description VARCHAR(255),
    amount DECIMAL(10, 2),
    type BOOLEAN
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
CREATE INDEX IF NOT EXISTS idx_entries_amount ON entries(amount);
CREATE INDEX IF NOT EXISTS idx_entries_type ON entries(type);

