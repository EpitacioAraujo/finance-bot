-- Migration: Add user_id to entries
-- Description: Adds user reference column and updates indexes

ALTER TABLE entries
    ADD COLUMN IF NOT EXISTS user_id VARCHAR(26);

ALTER TABLE entries
    ADD CONSTRAINT IF NOT EXISTS fk_entries_users
    FOREIGN KEY (user_id) REFERENCES users(id);

CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);
