import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const PLACEHOLDER_PATTERNS = ["your-project-id", "your-anon-key", "placeholder"];

function isPlaceholder(value) {
  if (!value) return true;
  const lower = value.toLowerCase();
  return PLACEHOLDER_PATTERNS.some((p) => lower.includes(p));
}

export const isSupabaseConfigured = () =>
  Boolean(supabaseUrl && supabaseAnonKey && !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey));

if (!isSupabaseConfigured()) {
  console.warn(
    "[Lumenote] Supabase not configured. Copy .env.example → .env and add your Project URL + anon key."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export function getSupabaseConfig() {
  return {
    url: supabaseUrl ?? "",
    configured: isSupabaseConfigured(),
  };
}
