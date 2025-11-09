-- Migration: Create Users Table
-- Description: Creates the main users table for authentication and user management

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(26) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    number_phone VARCHAR(20) NOT NULL UNIQUE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_number_phone ON users(number_phone);
