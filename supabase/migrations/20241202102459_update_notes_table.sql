ALTER TABLE notes DROP CONSTRAINT notes_user_id_fkey;

ALTER TABLE notes
ADD CONSTRAINT notes_user_id_fkey
FOREIGN KEY (user_id) REFERENCES clients (id) ON DELETE CASCADE;
