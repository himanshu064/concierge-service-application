import { createClient, SupabaseClient } from "@supabase/supabase-js";

import ENV from "@/env";

class SupabaseDB {
  private static instance: SupabaseClient | null = null;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getInstance(): SupabaseClient {
    if (!SupabaseDB.instance) {
      SupabaseDB.instance = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY);
    }
    return SupabaseDB.instance;
  }
}

const db = SupabaseDB.getInstance();

export default db;
