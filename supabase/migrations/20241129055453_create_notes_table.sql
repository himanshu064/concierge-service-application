CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES clients (id)
);
