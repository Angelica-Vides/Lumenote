import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import { createNote, deleteNote, fetchNotes, updateNote } from "../lib/notes";

function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return Number(b.pinned) - Number(a.pinned);
    return new Date(b.updated_at) - new Date(a.updated_at);
  });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState(null);
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

  const handleCreate = async (form) => {
    const created = await createNote(user.id, form);
    setNotes((prev) => sortNotes([created, ...prev]));
    setError("");
  };

  const handleUpdate = async (form) => {
    const updated = await updateNote(editingNote.id, {
      title: form.title,
      body: form.body,
      color: form.color,
    });
    setNotes((prev) => sortNotes(prev.map((n) => (n.id === updated.id ? updated : n))));
    setEditingNote(null);
    setError("");
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
      if (editingNote?.id === noteId) setEditingNote(null);
      setError("");
    } catch (err) {
      setError(err.message || "Could not delete note.");
    } finally {
      setPendingNoteId(null);
    }
  };

  return (
    <section className="dashboard container">
      <header className="dashboard__header">
        <div>
          <h1>My Notes</h1>
          <p className="muted">Create, edit, and pin your personal notes</p>
        </div>
      </header>

      {editingNote ? (
        <NoteForm
          key={editingNote.id}
          initial={{
            title: editingNote.title,
            body: editingNote.body,
            color: editingNote.color,
          }}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
          onCancel={() => setEditingNote(null)}
        />
      ) : (
        <NoteForm onSubmit={handleCreate} />
      )}

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
        <div className="loading-panel" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          Loading notes…
        </div>
      ) : (
        <NoteList
          notes={notes}
          onEdit={setEditingNote}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
          pendingNoteId={pendingNoteId}
        />
      )}
    </section>
  );
}
