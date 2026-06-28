import NoteCard from "./NoteCard";
import EmptyState from "./EmptyState";

export default function NoteList({ notes, onEdit, onDelete, onTogglePin }) {
  if (notes.length === 0) {
    return <EmptyState />;
  }

  const pinned = notes.filter((n) => n.pinned);
  const unpinned = notes.filter((n) => !n.pinned);

  return (
    <div className="note-list">
      {pinned.length > 0 && (
        <section>
          <h3 className="note-list__heading">Pinned ({pinned.length})</h3>
          <div className="note-grid">
            {pinned.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePin={onTogglePin}
              />
            ))}
          </div>
        </section>
      )}

      {unpinned.length > 0 && (
        <section>
          <h3 className="note-list__heading">Your notes ({unpinned.length})</h3>
          <div className="note-grid">
            {unpinned.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePin={onTogglePin}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
