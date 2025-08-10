import { createClient } from '@supabase/supabase-js'

// These values come from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://omnuzylsdxpcqumbhhim.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbnV6eWxzZHhwY3F1bWJoaGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDY4ODIsImV4cCI6MjA2Mzg4Mjg4Mn0.OFbLEs5vtfwkVKtoaAYy5AgHJHC6WG7Ftp9-qRvArTg'

// This creates the connection to your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
