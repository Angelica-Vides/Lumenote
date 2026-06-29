import { useCallback, useEffect, useState } from "react";
import { fetchNotes } from "../lib/notes";
import NoteList from "../components/NoteList";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message || "Could not load notes.");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return (
    <section className="dashboard container">
      <header className="dashboard__header">
        <div>
          <h1>My Notes</h1>
          <p className="muted">Your personal notes from Supabase</p>
        </div>
      </header>

      {loading && (
        <p className="dashboard__status muted" role="status">
          Loading notes…
        </p>
      )}

      {error && (
        <p className="form-error dashboard__error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && <NoteList notes={notes} />}
    </section>
  );
}
