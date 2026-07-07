import { useNavigate } from "react-router-dom";
import PinBadge from "./PinBadge";
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

function shouldOfferFullView(body = "") {
  if (isEmptyNoteBody(body)) return false;
  if (hasRichContent(body)) return true;
  return notePreviewText(body).endsWith("…");
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onDuplicate,
  onRunAi,
  disabled = false,
}) {
  const navigate = useNavigate();
  const rich = hasRichContent(note.body);
  const plainPreview = notePreviewText(note.body);
  const showFullView = shouldOfferFullView(note.body);

  return (
    <article
      className={`note-card card${note.pinned ? " note-card--pinned" : ""}`}
      style={{ "--note-color": note.color }}
    >
      {note.pinned && <PinBadge />}
      <h4 className="note-card__title">{note.title}</h4>

      {rich ? (
        <div
          className="note-card__body note-card__body--rich"
          dangerouslySetInnerHTML={{ __html: sanitizeNoteHtml(note.body) }}
        />
      ) : (
        <p className="note-card__body">{plainPreview}</p>
      )}

      {showFullView && (
        <button
          type="button"
          className="note-card__expand btn btn--ghost btn--sm"
          onClick={() => navigate(`/notes/${note.id}`)}
        >
          View full note
        </button>
      )}

      <p className="note-card__meta">Updated {formatDate(note.updated_at)}</p>
      <div className="note-card__actions">
        {onRunAi && (
          <>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onRunAi(note, "summarize")}
              disabled={disabled}
              title="Summarize this note with AI"
            >
              AI summary
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onRunAi(note, "suggest")}
              disabled={disabled}
              title="Suggest study notes from this note"
            >
              AI ideas
            </button>
          </>
        )}
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
        {onDuplicate && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => onDuplicate(note)}
            disabled={disabled}
          >
            Duplicate
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
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
