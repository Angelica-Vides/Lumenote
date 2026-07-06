export default function PinBadge() {
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
