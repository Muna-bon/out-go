import { createClient } from "@supabase/supabase-js";

// Provide safe defaults so client initialization never throws an uncaught exception
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://nqeyqinivmeljzyprezt.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZXlxaW5pdm1lbGp6eXByZXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDM3NDQsImV4cCI6MjA4ODcxOTc0NH0.JuDOwR0swEJvv9cCd36Ry2xTfkcrLv0Uspu367QXfr8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
