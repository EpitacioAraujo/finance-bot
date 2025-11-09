-- Migration: Create Seeds Control Table
-- Description: Creates the seeds table to track which seed files have been applied

CREATE TABLE IF NOT EXISTS seeds (
    id SERIAL PRIMARY KEY,
    seed_name VARCHAR(255) NOT NULL UNIQUE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(64),
    description TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_seeds_name ON seeds(seed_name);
CREATE INDEX IF NOT EXISTS idx_seeds_applied_at ON seeds(applied_at);