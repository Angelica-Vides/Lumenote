import { isSupabaseConfigured, supabase } from "./supabase";

/**
 * Verify the app can reach Supabase Auth (no notes table required yet).
 * Returns { ok, message } for UI display during Step 2 verify.
 */
export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Missing env vars — copy .env.example to .env and add your Supabase URL and anon key.",
    };
  }

  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      return { ok: false, message: `Connection failed: ${error.message}` };
    }
    return { ok: true, message: "Connected to Supabase." };
  } catch (err) {
    return { ok: false, message: err.message || "Could not reach Supabase." };
  }
}
