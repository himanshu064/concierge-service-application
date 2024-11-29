# Supabase Tables Migration Steps

1. **Install Supabase**

```bash
    npm install supabase
```

2. **Login to Supabase CLI**

```bash
    npx supabase login
```

This will prompt you to enter your Supabase access token. You can find the token in your Supabase Account Settings.

3. **Initialize a Supabase Project Locally**

```bash
    npx supabase init
```

4. **Link Supabase Project**

To link your local Supabase project to a specific remote project, use the following command:

```bash
    supabase link --project-ref <project-ref>
```

Replace <project-ref> with your Supabase project reference ID, which can be found in your Supabase dashboard.

5.  **Create a Migration**

```bash
    npx supabase migration new <migration_name>
```

### Example:

```bash
    npx supabase migration new create_users_table
```

This generates a file like `supabase/migrations/20240101_create_users_table.sql`.

6. **Define Schema Changes in the Migration File**

Edit the generated migration file to define your schema changes. For example:

```bash
-- supabase/migrations/20240101_create_users_table.sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

7. **Apply the Migration to the Supabase Database**

```bash
    npx supabase db push
```

This command synchronizes your local migration files with the remote Supabase database.
