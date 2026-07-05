export default function LogoMark({ className = "", size = 28 }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="header-glow" x1="8" y1="4" x2="24" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <radialGradient id="header-spark" cx="16" cy="9" r="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#99f6e4" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="#151922" />
      <circle cx="16" cy="9" r="6" fill="url(#header-spark)" />
      <circle cx="16" cy="9" r="3.2" fill="url(#header-glow)" />
      <rect x="8.5" y="12.5" width="15" height="16" rx="2.5" fill="#0c0e12" stroke="#2dd4bf" strokeWidth="1.4" />
      <path
        d="M12 17.5h8M12 20.5h6.5M12 23.5h7.5"
        stroke="#2dd4bf"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}
