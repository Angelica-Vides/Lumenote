import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AiAssistant from "../components/AiAssistant";
import ConfirmModal from "../components/ConfirmModal";
import NoteList from "../components/NoteList";
import NoteListSkeleton from "../components/NoteListSkeleton";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { applyNoteFilters, SORT_OPTIONS } from "../lib/noteFilters";
import { createNote, deleteNote, duplicateNote, fetchNotes, updateNote } from "../lib/notes";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingNoteId, setPendingNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated_desc");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [aiFocus, setAiFocus] = useState(null);

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

  useEffect(() => {
    if (!location.state?.aiNoteIds?.length) return;
    setAiFocus({
      noteIds: location.state.aiNoteIds,
      action: location.state.aiAction || null,
    });
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const visibleNotes = useMemo(
    () => applyNoteFilters(notes, { query: searchQuery, sortBy }),
    [notes, searchQuery, sortBy],
  );

  const handleEdit = (note) => {
    navigate(`/notes/${note.id}/edit`);
  };

  const handleTogglePin = async (note) => {
    setPendingNoteId(note.id);
    try {
      const updated = await updateNote(note.id, { pinned: !note.pinned });
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setError("");
      showToast(updated.pinned ? "Note pinned." : "Note unpinned.");
    } catch (err) {
      setError(err.message || "Could not update note.");
    } finally {
      setPendingNoteId(null);
    }
  };

  const handleDeleteRequest = (noteId) => {
    const note = notes.find((item) => item.id === noteId);
    if (!note) return;
    setDeleteTarget(note);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setPendingNoteId(deleteTarget.id);
    try {
      await deleteNote(deleteTarget.id);
      setNotes((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setError("");
      showToast(`Deleted "${deleteTarget.title}".`);
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || "Could not delete note.");
    } finally {
      setPendingNoteId(null);
    }
  };

  const handleDuplicate = async (note) => {
    setPendingNoteId(note.id);
    try {
      const copy = await duplicateNote(user.id, note);
      setNotes((prev) => [copy, ...prev]);
      showToast(`Duplicated "${note.title}".`);
    } catch (err) {
      setError(err.message || "Could not duplicate note.");
    } finally {
      setPendingNoteId(null);
    }
  };

  const handleRunAiForNote = (note, action) => {
    setAiFocus({ noteIds: [note.id], action });
    document.getElementById("ai-assistant")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNoteCreatedFromSuggestion = (note) => {
    setNotes((prev) => applyNoteFilters([note, ...prev], { query: searchQuery, sortBy }));
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

      <div id="ai-assistant">
        <AiAssistant
          notes={notes}
          focusSelection={aiFocus}
          onFocusHandled={() => setAiFocus(null)}
          onNoteCreated={handleNoteCreatedFromSuggestion}
        />
      </div>

      {!loading && notes.length > 0 && (
        <div className="notes-toolbar card">
          <label className="notes-toolbar__search">
            <span className="visually-hidden">Search notes</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search notes by title or body…"
            />
          </label>
          <label className="notes-toolbar__sort">
            <span>Sort</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
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
        <div className="dashboard__loading notes-board" role="status" aria-live="polite">
          <span className="visually-hidden">Loading notes…</span>
          <NoteListSkeleton />
        </div>
      ) : (
        <NoteList
          notes={visibleNotes}
          totalCount={notes.length}
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          onTogglePin={handleTogglePin}
          onDuplicate={handleDuplicate}
          onRunAi={handleRunAiForNote}
          pendingNoteId={pendingNoteId}
        />
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete note?"
        message={
          deleteTarget
            ? `Delete "${deleteTarget.title}" permanently? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete note"
        danger
        busy={Boolean(pendingNoteId && deleteTarget && pendingNoteId === deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
