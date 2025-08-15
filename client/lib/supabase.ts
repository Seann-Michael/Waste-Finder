import { createClient } from "@supabase/supabase-js";

// For Vite, we need to use import.meta.env instead of process.env
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;

// Create real Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
