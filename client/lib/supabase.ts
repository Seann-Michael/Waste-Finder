import { createClient } from "@supabase/supabase-js";

// For Vite, we need to use import.meta.env instead of process.env
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;

// Validate environment variables
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isPlaceholder = (value: string | undefined) =>
  !value ||
  value.startsWith("YOUR_") ||
  value === "your_supabase_" ||
  value.length < 10;

// Create Supabase client with proper validation
let supabase: any;

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  isPlaceholder(supabaseUrl) ||
  isPlaceholder(supabaseAnonKey) ||
  !isValidUrl(supabaseUrl)
) {
  console.warn("⚠️  Supabase configuration missing or invalid!");
  console.warn("📋 To connect to your database:");
  console.warn("1. Set VITE_SUPABASE_URL to your Supabase project URL");
  console.warn("2. Set VITE_SUPABASE_PUBLIC_KEY to your Supabase anon key");
  console.warn("3. Or connect via: [Connect to Supabase](#open-mcp-popover)");

  // Create a mock client that throws helpful errors when used
  supabase = {
    from: () => {
      throw new Error("Supabase not configured. Please set environment variables or connect to Supabase.");
    },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  };
} else {
  console.log("✅ Supabase client initialized successfully");
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
