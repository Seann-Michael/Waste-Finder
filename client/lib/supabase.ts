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
  console.error("❌ Supabase configuration missing or invalid!");
  console.error("📋 To connect to your database:");
  console.error("1. Set VITE_SUPABASE_URL to your Supabase project URL");
  console.error("2. Set VITE_SUPABASE_PUBLIC_KEY to your Supabase anon key");
  console.error("3. Or connect via: [Connect to Supabase](#open-mcp-popover)");

  // Throw error instead of creating invalid client
  throw new Error(
    "Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLIC_KEY environment variables or connect to Supabase."
  );
} else {
  console.log("✅ Supabase client initialized successfully");
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
