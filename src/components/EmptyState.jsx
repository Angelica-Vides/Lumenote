export default function EmptyState() {
  return (
    <div className="empty-state card empty-state--wide">
      <div className="empty-state__illus" aria-hidden="true">
        <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="30" width="80" height="100" rx="6" fill="#151922" stroke="#2a3142" strokeWidth="2" />
          <line x1="55" y1="55" x2="105" y2="55" stroke="#2a3142" strokeWidth="2" strokeLinecap="round" />
          <line x1="55" y1="70" x2="95" y2="70" stroke="#2a3142" strokeWidth="2" strokeLinecap="round" />
          <line x1="55" y1="85" x2="100" y2="85" stroke="#2a3142" strokeWidth="2" strokeLinecap="round" />
          <circle cx="80" cy="20" r="12" fill="#2dd4bf" opacity="0.9" />
          <line x1="80" y1="8" x2="80" y2="2" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
          <line x1="92" y1="20" x2="98" y2="20" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
          <line x1="68" y1="20" x2="62" y2="20" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
          <line x1="88" y1="12" x2="92" y2="8" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
          <line x1="72" y1="12" x2="68" y2="8" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3>No notes yet</h3>
      <p>Create your first note using the form above. Your ideas deserve a place to live.</p>
      <p className="empty-state__hint">↑ Start with a title and hit Save note</p>
    </div>
  );
}
