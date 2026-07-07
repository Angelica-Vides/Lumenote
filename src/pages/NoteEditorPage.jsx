import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createNote, fetchNote, updateNote } from "../lib/notes";

export default function NoteEditorPage({ mode = "edit" }) {
  const { noteId } = useParams();
  const isNew = mode === "new";
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return undefined;

    let active = true;
    setLoading(true);
    setError("");

    fetchNote(noteId)
      .then((data) => {
        if (active) setNote(data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Could not load note.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isNew, noteId]);

  const goToNotes = () => navigate("/dashboard");

  const handleCreate = async (form) => {
    await createNote(user.id, form);
    showToast("Note saved.");
    navigate("/dashboard", { replace: true });
  };

  const handleUpdate = async (form) => {
    await updateNote(noteId, {
      title: form.title,
      body: form.body,
      color: form.color,
    });
    showToast("Changes saved.");
    navigate("/dashboard", { replace: true });
  };

  if (!isNew && loading) {
    return (
      <section className="note-editor-page container">
        <div className="note-editor-page__loading" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          Loading note…
        </div>
      </section>
    );
  }

  if (!isNew && (error || !note)) {
    return (
      <section className="note-editor-page container">
        <header className="note-editor-page__header">
          <Link to="/dashboard" className="note-editor-page__back">
            ← Back to notes
          </Link>
        </header>
        <div className="note-editor-page__error card">
          <p className="form-error" role="alert">
            {error || "That note could not be found."}
          </p>
          <button type="button" className="btn btn--ghost" onClick={goToNotes}>
            Return to My Notes
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="note-editor-page container">
      {!isNew && (
        <header className="note-editor-page__header note-editor-page__header--compact">
          <Link to="/dashboard" className="note-editor-page__back">
            ← Back to My Notes
          </Link>
          <h1>Edit note</h1>
          <p className="muted">Update your note and save your changes.</p>
        </header>
      )}

      {isNew && (
        <header className="note-editor-page__header note-editor-page__header--compact">
          <p className="muted">
            Add a title and body below. Use the toolbar for headings, lists, fonts, and images.
          </p>
        </header>
      )}

      <NoteForm
        key={isNew ? "new" : note.id}
        showHeading={false}
        initial={
          isNew
            ? undefined
            : {
                title: note.title,
                body: note.body,
                color: note.color,
              }
        }
        submitLabel={isNew ? "Save note" : "Save changes"}
        cancelLabel="Cancel"
        onSubmit={isNew ? handleCreate : handleUpdate}
        onCancel={goToNotes}
      />
    </section>
  );
}
