export default function NoteListSkeleton({ count = 4 }) {
  return (
    <div className="note-list note-list--loading" aria-hidden="true">
      <div className="note-grid">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="note-card note-card--skeleton card">
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
            <div className="skeleton skeleton--actions" />
          </div>
        ))}
      </div>
    </div>
  );
}
