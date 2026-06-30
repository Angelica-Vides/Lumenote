import { useEffect, useState } from "react";
import { checkSupabaseConnection } from "../lib/supabaseHealth";
import { isSupabaseConfigured } from "../lib/supabase";

export default function SupabaseStatus() {
  const [status, setStatus] = useState({ loading: true, ok: null, message: "" });

  useEffect(() => {
    let cancelled = false;

    checkSupabaseConnection().then((result) => {
      if (!cancelled) {
        setStatus({ loading: false, ok: result.ok, message: result.message });
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status.loading) return null;

  if (status.ok && isSupabaseConfigured()) return null;

  const className = status.ok
    ? "supabase-status supabase-status--ok card"
    : "supabase-status supabase-status--warn card";

  return (
    <div className="container supabase-status-wrap">
      <div className={className} role="status">
        <strong>{status.ok ? "Supabase connected" : "Supabase not configured"}</strong>
        <p>{status.message}</p>
        {!isSupabaseConfigured() && (
          <p className="supabase-status__steps">
            1. Create a project at{" "}
            <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">
              supabase.com/dashboard
            </a>
            <br />
            2. Copy <code>.env.example</code> → <code>.env</code>
            <br />
            3. Paste <strong>Project URL</strong> and <strong>anon public key</strong> from Settings → API
          </p>
        )}
      </div>
    </div>
  );
}
