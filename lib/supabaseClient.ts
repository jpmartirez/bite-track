import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    Boolean(supabaseAnonKey) &&
    supabaseAnonKey !== "your-anon-public-key-here"
  );
};