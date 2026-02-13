"use client";

import Link from "next/link";

export default function BackButton({ label = "Back to Home" }) {
  return (
    <Link
      href="/"
      className="back-home-btn mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <svg
        className="back-home-arrow h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {label}
      <span className="back-home-mascot" aria-hidden="true">
        <svg viewBox="0 0 36 36" className="h-5 w-5" fill="none">
          <circle cx="18" cy="18" r="15" fill="#22d3ee" />
          <circle cx="13.2" cy="14.5" r="2.4" fill="#0f172a" />
          <circle cx="22.8" cy="14.5" r="2.4" fill="#0f172a" />
          <path
            d="M12.5 22.5c2.8 3.2 8.2 3.2 11 0"
            stroke="#0f172a"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </Link>
  );
}
