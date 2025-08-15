import { createClient } from "@supabase/supabase-js";

// For Vite, we need to use import.meta.env instead of process.env
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;

// Check if environment variables are set to placeholder values
const isPlaceholder = (value: string | undefined) =>
  !value || value.startsWith('YOUR_') || value === 'your_supabase_' || value.length < 10;

// Create mock supabase client for development without credentials
const createMockSupabaseClient = () => ({
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: { message: "Supabase not configured" } }),
    update: () => ({ data: null, error: { message: "Supabase not configured" } }),
    delete: () => ({ data: null, error: { message: "Supabase not configured" } }),
    eq: function() { return this; },
    order: function() { return this; },
    single: function() { return this; },
  }),
  auth: {
    signUp: () => ({ data: null, error: { message: "Supabase not configured" } }),
    signIn: () => ({ data: null, error: { message: "Supabase not configured" } }),
    signOut: () => ({ error: null }),
    getSession: () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
});

// Validate that we have real (non-placeholder) values
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey || isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
  console.warn("Supabase environment variables not configured properly. Using mock client.");
  console.warn("To connect to Supabase, set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLIC_KEY environment variables");
  supabase = createMockSupabaseClient();
} else {
  // This creates the real connection to your database
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
