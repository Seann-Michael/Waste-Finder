import { createClient } from "@supabase/supabase-js";

// For Vite, we need to use import.meta.env instead of process.env
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;

// Check if environment variables are set to placeholder values
const isPlaceholder = (value: string | undefined) =>
  !value || value.startsWith('YOUR_') || value === 'your_supabase_' || value.length < 10;

// Validate that we have real (non-placeholder) values
if (!supabaseUrl || !supabaseAnonKey || isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
  console.warn("Supabase environment variables not configured properly. Using mock client.");
  // Create a mock client that won't throw errors but will log warnings
}

// This creates the connection to your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
