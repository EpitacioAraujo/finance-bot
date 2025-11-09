-- Seed: Create Default Admin User
-- Description: Creates a default admin user for testing and initial setup

-- Insert default admin user (password: 'admin123')
INSERT INTO users (id, username, number_phone) 
VALUES (
    '01K8H0AR8AGRBX5AHB0VBAYKPH',
    'admin',
    '5588997761060'
) ON CONFLICT (username) DO NOTHING;
