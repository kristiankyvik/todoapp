-- Add description column to todos table
ALTER TABLE todos
ADD COLUMN description TEXT;

-- Update RLS policies to include description column
-- The existing policies already use SELECT *, so they automatically include the new column