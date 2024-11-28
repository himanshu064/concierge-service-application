CREATE TABLE clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    contact TEXT NOT NULL,
    address TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT,
    nationality TEXT,
    created_at TIMESTAMP DEFAULT now()
);