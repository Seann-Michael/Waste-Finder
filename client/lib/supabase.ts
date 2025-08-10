import { createClient } from "@supabase/supabase-js";

// For Vite, we need to use import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://omnuzylsdxpcqumbhhim.supabase.co";

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbnV6eWxzZHhwY3F1bWJoaGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDY4ODIsImV4cCI6MjA2Mzg4Mjg4Mn0.OFbLEs5vtfwkVKtoaAYy5AgHJHC6WG7Ftp9-qRvArTg";

// Validate that we have the required values
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required');
}

// This creates the connection to your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
