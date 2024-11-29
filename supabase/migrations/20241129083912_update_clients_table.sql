CREATE TYPE is_authorized_enum AS ENUM ('approved', 'pending');
CREATE TYPE register_type_enum AS ENUM ('invited', 'self');
CREATE TYPE role_enum AS ENUM ('Admin', 'Client');

ALTER TABLE clients
ADD COLUMN isAuthorized is_authorized_enum DEFAULT 'pending';

ALTER TABLE clients
ADD COLUMN registerType register_type_enum DEFAULT 'self';

ALTER TABLE clients
ADD COLUMN role role_enum DEFAULT 'Admin';