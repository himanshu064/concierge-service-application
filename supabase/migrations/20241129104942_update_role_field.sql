-- Step 1: Create the new enum type
CREATE TYPE role_enum_new AS ENUM ('admin', 'client');

-- Step 2: Temporarily cast the column to TEXT
ALTER TABLE clients ALTER COLUMN role TYPE TEXT USING role::TEXT;

-- Step 3: Update existing values to match the new enum values
UPDATE clients SET role = 'admin' WHERE role = 'Admin';
UPDATE clients SET role = 'client' WHERE role = 'Client';

-- Step 4: Change the column to the new enum type
ALTER TABLE clients ALTER COLUMN role TYPE role_enum_new USING role::role_enum_new;

-- Step 5: Drop the old enum type
DROP TYPE role_enum;

-- Step 6: Rename the new enum type to the original name (optional)
ALTER TYPE role_enum_new RENAME TO role_enum;

-- Step 7: Set the new default value
ALTER TABLE clients ALTER COLUMN role SET DEFAULT 'client';