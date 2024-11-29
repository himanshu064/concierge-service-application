import { createClient } from "@supabase/supabase-js";
import ENV from "@/env";

const supabaseAdmin = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_SERVICE_ROLE_KEY
);

export default supabaseAdmin;