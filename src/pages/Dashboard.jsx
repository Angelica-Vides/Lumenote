import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import { createNote, deleteNote, fetchNotes } from "../lib/notes";

export default function Dashboard() {
  const { user } = useAuth();
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

  const handleCreate = async (form) => {
    const created = await createNote(user.id, form);
    setNotes((prev) => [created, ...prev]);
    setError("");
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note permanently?")) return;

    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setError("");
    } catch (err) {
      setError(err.message || "Could not delete note.");
    }
  };

  return (
    <section className="dashboard container">
      <header className="dashboard__header">
        <div>
          <h1>My Notes</h1>
          <p className="muted">Create and manage your personal notes</p>
        </div>
      </header>

      <NoteForm onSubmit={handleCreate} />

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

      {!loading && !error && <NoteList notes={notes} onDelete={handleDelete} />}
    </section>
  );
}
