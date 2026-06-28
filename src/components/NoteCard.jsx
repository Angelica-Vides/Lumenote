function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  const preview = note.body
    ? note.body.length > 140
      ? `${note.body.slice(0, 140)}…`
      : note.body
    : "No content";

  return (
    <article className="note-card card" style={{ "--note-color": note.color }}>
      <h4 className="note-card__title">{note.title}</h4>
      <p className="note-card__body">{preview}</p>
      <p className="note-card__meta">
        Updated {formatDate(note.updated_at)} · {note.color}
      </p>
      <div className="note-card__actions">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => onTogglePin(note)}>
          {note.pinned ? "Unpin" : "Pin"}
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button type="button" className="btn btn--danger btn--sm" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
