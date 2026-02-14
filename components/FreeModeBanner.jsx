"use client";

export default function FreeModeBanner({
  primary = "Gemini",
  fallback = "Groq",
  queueDepth = 0,
  quotaUsed = 42,
}) {
  const quotaWidth = Math.max(0, Math.min(100, quotaUsed));

  return (
    <section className="content-card mb-4 border border-sky-200 bg-sky-50/80 p-4 dark:border-sky-800/60 dark:bg-sky-900/20">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-800 dark:bg-sky-900/50 dark:text-sky-200">
          Free Mode
        </span>
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Primary: {primary}
        </span>
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Fallback: {fallback}
        </span>
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Queue: {queueDepth}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-sky-100 dark:bg-sky-950/60">
        <div
          className="h-2 rounded-full bg-sky-500"
          style={{ width: `${quotaWidth}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
        Daily quota usage estimate: {quotaUsed}%. Long jobs auto-queue and retry
        on free-tier rate limits.
      </p>
    </section>
  );
}
