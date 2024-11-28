import ENV from "@/env";
import { createClient } from "@refinedev/supabase";

export const supabaseClient = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
  },
});
