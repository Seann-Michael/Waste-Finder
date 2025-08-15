import { createClient } from "@supabase/supabase-js";

// For Vite, we need to use import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that we have the required values
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key are required");
}

// This creates the connection to your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
