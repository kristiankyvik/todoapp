-- Add priority column to todos table
ALTER TABLE todos
ADD COLUMN priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent'));