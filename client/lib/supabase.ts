import { createClient } from "@supabase/supabase-js";

// For Vite, we need to use import.meta.env instead of process.env
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;

// Check if environment variables are set to placeholder values
const isPlaceholder = (value: string | undefined) =>
  !value ||
  value.startsWith("YOUR_") ||
  value === "your_supabase_" ||
  value.length < 10;

// Create mock supabase client for development without credentials
const createMockSupabaseClient = () => {
  const mockQueryBuilder = {
    select: function (columns?: string) {
      return this;
    },
    insert: function (data: any) {
      return this;
    },
    update: function (data: any) {
      return this;
    },
    delete: function () {
      return this;
    },
    eq: function (column: string, value: any) {
      return this;
    },
    neq: function (column: string, value: any) {
      return this;
    },
    gt: function (column: string, value: any) {
      return this;
    },
    gte: function (column: string, value: any) {
      return this;
    },
    lt: function (column: string, value: any) {
      return this;
    },
    lte: function (column: string, value: any) {
      return this;
    },
    like: function (column: string, value: any) {
      return this;
    },
    ilike: function (column: string, value: any) {
      return this;
    },
    is: function (column: string, value: any) {
      return this;
    },
    in: function (column: string, values: any[]) {
      return this;
    },
    or: function (query: string) {
      return this;
    },
    and: function (query: string) {
      return this;
    },
    order: function (column: string, options?: any) {
      return this;
    },
    limit: function (count: number) {
      return this;
    },
    range: function (from: number, to: number) {
      return this;
    },
    single: function () {
      return Promise.resolve({
        data: null,
        error: { message: "Supabase not configured - using mock data" },
      });
    },
    // Make the query builder thenable (Promise-like) for async/await
    then: function (onFulfilled: any, onRejected?: any) {
      // Return appropriate mock data based on the expected response
      const mockResponse = {
        data: [],
        error: null,
      };
      return Promise.resolve(mockResponse).then(onFulfilled, onRejected);
    },

    // Add catch method for Promise compatibility
    catch: function (onRejected: any) {
      return Promise.resolve({ data: [], error: null }).catch(onRejected);
    },
  };

  return {
    from: () => mockQueryBuilder,
    auth: {
      signUp: () =>
        Promise.resolve({
          data: null,
          error: { message: "Supabase not configured" },
        }),
      signIn: () =>
        Promise.resolve({
          data: null,
          error: { message: "Supabase not configured" },
        }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  };
};

// Validate that we have real (non-placeholder) values
let supabase: any;

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  isPlaceholder(supabaseUrl) ||
  isPlaceholder(supabaseAnonKey)
) {
  console.warn(
    "Supabase environment variables not configured properly. Using mock client.",
  );
  console.warn(
    "To connect to Supabase, set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLIC_KEY environment variables",
  );
  supabase = createMockSupabaseClient();
} else {
  // This creates the real connection to your database
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
