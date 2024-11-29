CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    client_id UUID UNIQUE REFERENCES clients(id) ON DELETE CASCADE
);
