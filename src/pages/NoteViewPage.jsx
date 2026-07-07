import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AiAssistant from "../components/AiAssistant";
import ConfirmModal from "../components/ConfirmModal";
import PinBadge from "../components/PinBadge";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { isEmptyNoteBody, sanitizeNoteHtml } from "../lib/noteBody";
import { deleteNote, duplicateNote, fetchNote, updateNote } from "../lib/notes";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NoteViewPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
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
  }, [noteId]);

  const handleTogglePin = async () => {
    if (!note) return;
    setPending(true);
    try {
      const updated = await updateNote(note.id, { pinned: !note.pinned });
      setNote(updated);
      showToast(updated.pinned ? "Note pinned." : "Note unpinned.");
    } catch (err) {
      setError(err.message || "Could not update note.");
    } finally {
      setPending(false);
    }
  };

  const handleDuplicate = async () => {
    if (!note || !user?.id) return;
    setPending(true);
    try {
      const copy = await duplicateNote(user.id, note);
      showToast(`Duplicated "${note.title}".`);
      navigate(`/notes/${copy.id}/edit`);
    } catch (err) {
      setError(err.message || "Could not duplicate note.");
    } finally {
      setPending(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!note) return;
    setPending(true);
    try {
      await deleteNote(note.id);
      showToast(`Deleted "${note.title}".`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Could not delete note.");
      setPending(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <section className="note-view-page container">
        <div className="note-view-page__loading" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          Loading note…
        </div>
      </section>
    );
  }

  if (error || !note) {
    return (
      <section className="note-view-page container">
        <Link to="/dashboard" className="note-view-page__back">
          ← Back to My Notes
        </Link>
        <div className="note-view-page__error card">
          <p className="form-error" role="alert">
            {error || "That note could not be found."}
          </p>
          <Link to="/dashboard" className="btn btn--ghost">
            Return to My Notes
          </Link>
        </div>
      </section>
    );
  }

  const bodyHtml = sanitizeNoteHtml(note.body);
  const hasBody = !isEmptyNoteBody(note.body);

  return (
    <section className="note-view-page container">
      <header className="note-view-page__header">
        <Link to="/dashboard" className="note-view-page__back">
          ← Back to My Notes
        </Link>
        <div className="note-view-page__actions">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={handleTogglePin}
            disabled={pending}
          >
            {note.pinned ? "Unpin" : "Pin"}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={handleDuplicate}
            disabled={pending}
          >
            Duplicate
          </button>
          <Link to={`/notes/${note.id}/edit`} className="btn btn--ghost btn--sm">
            Edit
          </Link>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={() => setDeleteOpen(true)}
            disabled={pending}
          >
            Delete
          </button>
        </div>
      </header>

      <article
        className={`note-view-page__paper card${note.pinned ? " note-view-page__paper--pinned" : ""}`}
        style={{ "--note-color": note.color }}
      >
        {note.pinned && <PinBadge />}
        <h1 className="note-view-page__title">{note.title}</h1>
        <p className="note-view-page__meta">Updated {formatDate(note.updated_at)}</p>

        {hasBody ? (
          <div
            className="note-view-page__body note-body-render"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : (
          <p className="note-view-page__empty muted">This note has no body text yet.</p>
        )}
      </article>

      {!hasBody && (
        <p className="note-view-page__hint muted">
          <Link to={`/notes/${note.id}/edit`}>Edit this note</Link> to add content.
        </p>
      )}

      <AiAssistant notes={[note]} compact onNoteCreated={() => showToast("Suggestion saved as a new note.")} />

      <ConfirmModal
        open={deleteOpen}
        title="Delete note?"
        message={`Delete "${note.title}" permanently? This cannot be undone.`}
        confirmLabel="Delete note"
        danger
        busy={pending}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
