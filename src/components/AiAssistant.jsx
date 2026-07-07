import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { runNoteAi } from "../lib/ai";
import { escapeHtml } from "../lib/noteBody";
import { createNote } from "../lib/notes";

function ResultList({ items, onCreateFromSuggestion, creatingTitle }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <ul className="ai-result__list">
      {items.map((item, index) => (
        <li key={typeof item === "string" ? `${item}-${index}` : `${item.title}-${index}`}>
          {typeof item === "string" ? (
            item
          ) : (
            <div className="ai-result__suggestion">
              <div>
                <strong>{item.title}</strong>
                <span>{item.rationale}</span>
                {item.starterText && <em>{item.starterText}</em>}
              </div>
              {onCreateFromSuggestion && (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => onCreateFromSuggestion(item)}
                  disabled={creatingTitle === item.title}
                >
                  {creatingTitle === item.title ? "Creating…" : "Create note"}
                </button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function AiResult({ response, onCreateFromSuggestion, creatingTitle }) {
  if (!response?.result) return null;

  const { action, result, notesAnalyzed, noteTitles } = response;
  const scopeLabel =
    Array.isArray(noteTitles) && noteTitles.length > 0
      ? `AI reviewed ${notesAnalyzed} note(s): ${noteTitles.join(", ")}.`
      : `AI reviewed ${notesAnalyzed} note(s).`;

  if (action === "suggest") {
    return (
      <div className="ai-result" aria-live="polite">
        <p className="ai-result__meta">{scopeLabel}</p>
        <ResultList
          items={result.suggestions}
          onCreateFromSuggestion={onCreateFromSuggestion}
          creatingTitle={creatingTitle}
        />
      </div>
    );
  }

  return (
    <div className="ai-result" aria-live="polite">
      <p className="ai-result__meta">{scopeLabel}</p>
      <p>{result.overview}</p>
      <h4>Key points</h4>
      <ResultList items={result.keyPoints} />
      <h4>Follow-ups</h4>
      <ResultList items={result.followUps} />
    </div>
  );
}

export default function AiAssistant({
  notes = [],
  focusSelection = null,
  onFocusHandled,
  onNoteCreated,
  compact = false,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loadingAction, setLoadingAction] = useState("");
  const [creatingTitle, setCreatingTitle] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedNoteIds, setSelectedNoteIds] = useState([]);

  const noteIds = useMemo(() => notes.map((note) => note.id), [notes]);
  const showPicker = !compact || notes.length > 1;

  useEffect(() => {
    setSelectedNoteIds((current) => {
      const valid = current.filter((id) => noteIds.includes(id));
      if (valid.length > 0) return valid;
      return noteIds;
    });
  }, [noteIds]);

  useEffect(() => {
    if (!focusSelection?.noteIds?.length) return;

    const nextSelection = focusSelection.noteIds.filter((id) => noteIds.includes(id));
    if (nextSelection.length === 0) {
      onFocusHandled?.();
      return;
    }

    setSelectedNoteIds(nextSelection);
    if (focusSelection.action) {
      runAction(focusSelection.action, nextSelection);
    }
    onFocusHandled?.();
  }, [focusSelection]);

  const allSelected = notes.length > 0 && selectedNoteIds.length === notes.length;
  const noneSelected = selectedNoteIds.length === 0;

  const toggleNote = (noteId) => {
    setSelectedNoteIds((current) =>
      current.includes(noteId) ? current.filter((id) => id !== noteId) : [...current, noteId],
    );
  };

  const selectAll = () => setSelectedNoteIds(noteIds);
  const clearSelection = () => setSelectedNoteIds([]);

  const runAction = async (action, ids = selectedNoteIds) => {
    if (ids.length === 0) {
      setError("Select at least one sticky note for AI analysis.");
      return;
    }

    setLoadingAction(action);
    setError("");
    try {
      const result = await runNoteAi(action, ids);
      setResponse(result);
    } catch (err) {
      setError(err.message || "AI assistant is unavailable. Please try again.");
    } finally {
      setLoadingAction("");
    }
  };

  const handleCreateFromSuggestion = async (suggestion) => {
    if (!user?.id || !suggestion?.title) return;

    setCreatingTitle(suggestion.title);
    setError("");
    try {
      const starter = suggestion.starterText?.trim();
      const body = starter ? `<p>${escapeHtml(starter)}</p>` : "";
      const note = await createNote(user.id, {
        title: suggestion.title,
        body,
      });
      showToast(`Created note "${note.title}".`);
      onNoteCreated?.(note);
      navigate(`/notes/${note.id}/edit`);
    } catch (err) {
      setError(err.message || "Could not create note from suggestion.");
    } finally {
      setCreatingTitle("");
    }
  };

  const disabled = notes.length === 0 || noneSelected || Boolean(loadingAction);

  return (
    <section className="ai-assistant card">
      <div>
        <p className="ai-assistant__eyebrow">AI study assistant</p>
        <h2>Turn your notes into next steps</h2>
        <p className="muted">
          {compact
            ? "Summarize this note or generate study ideas from it."
            : "Choose one or more sticky notes, then summarize them or generate study ideas from that selection."}
        </p>
      </div>

      {showPicker && notes.length > 0 && (
        <div className="ai-assistant__picker">
          <div className="ai-assistant__picker-header">
            <p className="ai-assistant__picker-label">
              Notes for AI ({selectedNoteIds.length}/{notes.length})
            </p>
            <div className="ai-assistant__picker-actions">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={selectAll}
                disabled={allSelected || Boolean(loadingAction)}
              >
                Select all
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={clearSelection}
                disabled={noneSelected || Boolean(loadingAction)}
              >
                Clear
              </button>
            </div>
          </div>

          <ul className="ai-assistant__note-list" aria-label="Choose notes for AI analysis">
            {notes.map((note) => {
              const checked = selectedNoteIds.includes(note.id);
              return (
                <li key={note.id}>
                  <label
                    className={`ai-assistant__note-option${checked ? " ai-assistant__note-option--selected" : ""}`}
                    style={{ "--note-color": note.color }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleNote(note.id)}
                      disabled={Boolean(loadingAction)}
                    />
                    <span className="ai-assistant__note-swatch" aria-hidden="true" />
                    <span className="ai-assistant__note-title">{note.title}</span>
                    {note.pinned && <span className="ai-assistant__note-pin">Pinned</span>}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="ai-assistant__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => runAction("summarize")}
          disabled={disabled}
        >
          {loadingAction === "summarize" ? "Summarizing..." : compact ? "Summarize this note" : "Summarize selected"}
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => runAction("suggest")}
          disabled={disabled}
        >
          {loadingAction === "suggest" ? "Thinking..." : compact ? "Suggest study notes" : "Suggest study notes"}
        </button>
      </div>

      {notes.length === 0 && (
        <p className="ai-assistant__hint">Create a note first, then Lumenote can analyze it.</p>
      )}

      {notes.length > 0 && noneSelected && (
        <p className="ai-assistant__hint">Select at least one sticky note above.</p>
      )}

      {loadingAction && (
        <div className="loading-panel loading-panel--compact" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          Asking AI to review your selected notes...
        </div>
      )}

      <AiResult
        response={response}
        onCreateFromSuggestion={handleCreateFromSuggestion}
        creatingTitle={creatingTitle}
      />
    </section>
  );
}
