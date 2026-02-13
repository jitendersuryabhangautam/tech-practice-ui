"use client";

function CharacterRobot({ className = "" }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <rect x="24" y="24" width="72" height="64" rx="18" fill="#fef3c7" />
      <rect x="34" y="40" width="18" height="14" rx="7" fill="#1e293b" />
      <rect x="68" y="40" width="18" height="14" rx="7" fill="#1e293b" />
      <rect x="44" y="62" width="32" height="8" rx="4" fill="#0f766e" />
      <rect x="52" y="12" width="16" height="14" rx="5" fill="#f59e0b" />
      <circle cx="60" cy="12" r="5" fill="#ef4444" />
      <rect x="30" y="88" width="18" height="20" rx="8" fill="#0ea5e9" />
      <rect x="72" y="88" width="18" height="20" rx="8" fill="#0ea5e9" />
    </svg>
  );
}

function CharacterCat({ className = "" }) {
  return (
    <svg viewBox="0 0 140 140" className={className} fill="none">
      <path d="M28 42 46 20l12 26" fill="#fdba74" />
      <path d="M112 42 94 20 82 46" fill="#fdba74" />
      <ellipse cx="70" cy="76" rx="44" ry="40" fill="#fb923c" />
      <circle cx="54" cy="72" r="7" fill="#1f2937" />
      <circle cx="86" cy="72" r="7" fill="#1f2937" />
      <path d="M70 82c-7 0-12 5-12 11 0 7 5 12 12 12s12-5 12-12c0-6-5-11-12-11Z" fill="#fde68a" />
      <path d="M50 92h-18M108 92h-18M48 102H30M110 102H92" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function CharacterGhost({ className = "" }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path
        d="M24 62c0-22 16-38 36-38s36 16 36 38v34l-10-8-10 8-10-8-10 8-10-8-10 8V62Z"
        fill="#bfdbfe"
      />
      <circle cx="50" cy="58" r="7" fill="#1e293b" />
      <circle cx="72" cy="58" r="7" fill="#1e293b" />
      <path d="M48 76c6 8 18 8 24 0" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function FloatingCharacters() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] hidden overflow-hidden lg:block"
    >
      <div className="floating-character floating-character-1">
        <CharacterRobot className="h-24 w-24 drop-shadow-[0_10px_18px_rgba(15,23,42,0.22)]" />
      </div>
      <div className="floating-character floating-character-2">
        <CharacterCat className="h-28 w-28 drop-shadow-[0_10px_18px_rgba(15,23,42,0.2)]" />
      </div>
      <div className="floating-character floating-character-3">
        <CharacterGhost className="h-24 w-24 drop-shadow-[0_10px_18px_rgba(15,23,42,0.2)]" />
      </div>
    </div>
  );
}
