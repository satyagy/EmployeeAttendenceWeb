-- ============================================
-- Create Admin User Manually
-- ============================================
-- This script creates the default admin user
-- Password: admin123 (hashed with bcrypt)
-- 
-- IMPORTANT: The password hash below is for "admin123"
-- If you want a different password, you'll need to hash it using bcrypt
-- You can use: https://bcrypt-generator.com/ or run the seed script

-- Default admin credentials:
-- Email: admin@example.com
-- Password: admin123

-- Delete existing admin if exists (optional - remove this if you want to keep existing)
-- DELETE FROM "users" WHERE "email" = 'admin@example.com';

-- Insert admin user
-- Note: The password hash is for "admin123" - 10 rounds of bcrypt
INSERT INTO "users" ("id", "email", "password", "name", "role", "createdAt", "updatedAt")
VALUES (
    'admin-' || gen_random_uuid()::text,  -- Generate unique ID
    'admin@example.com',
    '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq',  -- This is a placeholder - you need the actual hash
    'Admin User',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO NOTHING;

-- ============================================
-- IMPORTANT: The password hash above is a PLACEHOLDER
-- ============================================
-- You need to either:
-- 1. Run the seed script: npm run seed:admin
-- 2. Or generate a bcrypt hash for your password and replace the placeholder above
-- 
-- To generate bcrypt hash online: https://bcrypt-generator.com/
-- Or use Node.js: const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10)

