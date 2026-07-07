import NoteCard from "./NoteCard";
import EmptyState from "./EmptyState";

export default function NoteList({
  notes,
  totalCount = 0,
  searchQuery = "",
  onEdit,
  onDelete,
  onTogglePin,
  onDuplicate,
  onRunAi,
  pendingNoteId,
}) {
  if (totalCount === 0) {
    return <EmptyState />;
  }

  if (notes.length === 0) {
    return (
      <div className="note-list note-list--empty-search notes-board">
        <p className="muted">No notes match “{searchQuery}”. Try a different search.</p>
      </div>
    );
  }

  const pinned = notes.filter((n) => n.pinned);
  const unpinned = notes.filter((n) => !n.pinned);

  const cardProps = (note) => ({
    note,
    onEdit,
    onDelete,
    onTogglePin,
    onDuplicate,
    onRunAi,
    disabled: pendingNoteId === note.id,
  });

  return (
    <div className="note-list notes-board">
      {pinned.length > 0 && (
        <section>
          <h3 className="note-list__heading">Pinned ({pinned.length})</h3>
          <div className="note-grid">
            {pinned.map((note) => (
              <NoteCard key={note.id} {...cardProps(note)} />
            ))}
          </div>
        </section>
      )}

      {unpinned.length > 0 && (
        <section>
          <h3 className="note-list__heading">Your notes ({unpinned.length})</h3>
          <div className="note-grid">
            {unpinned.map((note) => (
              <NoteCard key={note.id} {...cardProps(note)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
