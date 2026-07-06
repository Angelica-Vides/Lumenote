import { useState } from "react";
import { isEmptyNoteBody, notePreviewText, sanitizeNoteHtml } from "../lib/noteBody";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function hasRichContent(body = "") {
  return body.includes("<") && !isEmptyNoteBody(body);
}

function PinBadge() {
  return (
    <div className="note-card__pin" aria-hidden="true" title="Pinned">
      <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="11" r="9" fill="#ef4444" />
        <circle cx="13" cy="8" r="2.5" fill="#fca5a5" opacity="0.85" />
        <path d="M16 20v14" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 34h8" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function NoteCard({ note, onEdit, onDelete, onTogglePin, disabled = false }) {
  const [expanded, setExpanded] = useState(false);
  const rich = hasRichContent(note.body);
  const plainPreview = notePreviewText(note.body);

  return (
    <article
      className={`note-card card${note.pinned ? " note-card--pinned" : ""}`}
      style={{ "--note-color": note.color }}
    >
      {note.pinned && <PinBadge />}
      <h4 className="note-card__title">{note.title}</h4>

      {rich ? (
        <>
          <div
            className={`note-card__body note-card__body--rich${expanded ? " note-card__body--expanded" : ""}`}
            dangerouslySetInnerHTML={{ __html: sanitizeNoteHtml(note.body) }}
          />
          <button
            type="button"
            className="note-card__expand btn btn--ghost btn--sm"
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? "Show less" : "View full note"}
          </button>
        </>
      ) : (
        <p className="note-card__body">{plainPreview}</p>
      )}

      <p className="note-card__meta">Updated {formatDate(note.updated_at)}</p>
      {(onEdit || onDelete || onTogglePin) && (
        <div className="note-card__actions">
          {onTogglePin && (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onTogglePin(note)}
              disabled={disabled}
            >
              {disabled ? "…" : note.pinned ? "Unpin" : "Pin"}
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onEdit(note)}
              disabled={disabled}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => onDelete(note.id)}
              disabled={disabled}
            >
              {disabled ? "…" : "Delete"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
