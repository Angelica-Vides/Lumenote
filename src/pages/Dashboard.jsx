import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AiAssistant from "../components/AiAssistant";
import NoteList from "../components/NoteList";
import NoteListSkeleton from "../components/NoteListSkeleton";
import { deleteNote, fetchNotes, updateNote } from "../lib/notes";

function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return Number(b.pinned) - Number(a.pinned);
    return new Date(b.updated_at) - new Date(a.updated_at);
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingNoteId, setPendingNoteId] = useState(null);

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

  const handleEdit = (note) => {
    navigate(`/notes/${note.id}/edit`);
  };

  const handleTogglePin = async (note) => {
    setPendingNoteId(note.id);
    try {
      const updated = await updateNote(note.id, { pinned: !note.pinned });
      setNotes((prev) => sortNotes(prev.map((n) => (n.id === updated.id ? updated : n))));
      setError("");
    } catch (err) {
      setError(err.message || "Could not update note.");
    } finally {
      setPendingNoteId(null);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note permanently?")) return;

    setPendingNoteId(noteId);
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setError("");
    } catch (err) {
      setError(err.message || "Could not delete note.");
    } finally {
      setPendingNoteId(null);
    }
  };

  return (
    <section className="dashboard container">
      <header className="dashboard__header dashboard__header--tabs">
        <div>
          <p className="muted">
            {loading
              ? "Loading your notes…"
              : notes.length === 0
                ? "You have no notes yet — open the New Note tab to get started."
                : `${notes.length} note${notes.length === 1 ? "" : "s"} · pinned notes stay at the top`}
          </p>
        </div>
      </header>

      <AiAssistant noteCount={notes.length} />

      {error && (
        <div className="dashboard__error">
          <p className="form-error" role="alert">
            {error}
          </p>
          <button type="button" className="btn btn--ghost btn--sm" onClick={loadNotes}>
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="dashboard__loading" role="status" aria-live="polite">
          <span className="visually-hidden">Loading notes…</span>
          <NoteListSkeleton />
        </div>
      ) : (
        <NoteList
          notes={notes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
          pendingNoteId={pendingNoteId}
        />
      )}
    </section>
  );
}
