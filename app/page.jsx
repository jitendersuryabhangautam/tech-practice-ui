"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

const TECHNOLOGIES = [
  {
    name: "JavaScript",
    href: "/javascript",
    description:
      "Closures, async patterns, event loop, and tricky interview edge cases.",
  },
  {
    name: "React",
    href: "/react",
    description:
      "Hooks, rendering lifecycle, performance patterns, and architecture Q&A.",
  },
  {
    name: "Next.js",
    href: "/nextjs",
    description:
      "App Router, caching, rendering modes, and deployment interview prep.",
  },
  {
    name: "System Design",
    href: "/system-design",
    description:
      "HLD/LLD case studies, flow diagrams, trade-offs, and real production architecture.",
  },
  {
    name: "Golang",
    href: "/golang",
    description:
      "Concurrency, memory model, interfaces, and production coding scenarios.",
  },
  {
    name: "PostgreSQL",
    href: "/postgresql",
    description:
      "Indexes, query tuning, transactions, and database design questions.",
  },
  {
    name: "Docker",
    href: "/docker",
    description:
      "Images, networking, Compose, hardening, and troubleshooting interviews.",
  },
  {
    name: "Kubernetes",
    href: "/kubernetes",
    description:
      "Workloads, services, scaling, debugging, and cluster operations.",
  },
];

function CardLogo({ name }) {
  const key = name.toLowerCase();

  if (key.includes("java")) {
    return (
      <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none">
        <circle cx="32" cy="32" r="28" fill="#fde68a" />
        <path d="M22 38h20M24 44h16" stroke="#7c2d12" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M32 18c5 3-2 6 3 9s-3 6 2 9" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (key.includes("go")) {
    return (
      <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none">
        <circle cx="32" cy="32" r="28" fill="#38bdf8" />
        <circle cx="24" cy="28" r="4.5" fill="#0f172a" />
        <circle cx="40" cy="28" r="4.5" fill="#0f172a" />
        <rect x="19" y="38" width="26" height="7" rx="3.5" fill="#082f49" />
      </svg>
    );
  }

  if (key.includes("postgres")) {
    return (
      <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none">
        <circle cx="32" cy="32" r="28" fill="#60a5fa" />
        <ellipse cx="32" cy="26" rx="13" ry="8" fill="#dbeafe" />
        <path d="M19 26v12c0 4 6 8 13 8s13-4 13-8V26" fill="#93c5fd" />
        <circle cx="27" cy="26" r="2.2" fill="#0f172a" />
        <circle cx="37" cy="26" r="2.2" fill="#0f172a" />
      </svg>
    );
  }

  if (key.includes("react")) {
    return (
      <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none">
        <circle cx="32" cy="32" r="28" fill="#155e75" />
        <ellipse cx="32" cy="32" rx="20" ry="8.5" stroke="#67e8f9" strokeWidth="3" />
        <ellipse cx="32" cy="32" rx="20" ry="8.5" stroke="#67e8f9" strokeWidth="3" transform="rotate(60 32 32)" />
        <ellipse cx="32" cy="32" rx="20" ry="8.5" stroke="#67e8f9" strokeWidth="3" transform="rotate(120 32 32)" />
        <circle cx="32" cy="32" r="4.5" fill="#67e8f9" />
      </svg>
    );
  }

  if (key.includes("next")) {
    return (
      <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none">
        <circle cx="32" cy="32" r="28" fill="#111827" />
        <path d="M20 42V22l24 20V22" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (key.includes("docker")) {
    return (
      <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none">
        <circle cx="32" cy="32" r="28" fill="#bae6fd" />
        <rect x="18" y="30" width="8" height="8" fill="#0284c7" />
        <rect x="27" y="30" width="8" height="8" fill="#0284c7" />
        <rect x="36" y="30" width="8" height="8" fill="#0284c7" />
        <rect x="27" y="21" width="8" height="8" fill="#0ea5e9" />
        <path d="M18 39h30c-2 6-8 9-15 9-8 0-13-3-15-9Z" fill="#0369a1" />
      </svg>
    );
  }

  if (key.includes("kubernetes")) {
    return (
      <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none">
        <circle cx="32" cy="32" r="28" fill="#93c5fd" />
        <circle cx="32" cy="32" r="11" stroke="#1d4ed8" strokeWidth="4" />
        <path d="M32 16v10M32 38v10M16 32h10M38 32h10M21 21l7 7M36 36l7 7M43 21l-7 7M28 36l-7 7" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (key.includes("system")) {
    return (
      <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none">
        <circle cx="32" cy="32" r="28" fill="#c7d2fe" />
        <rect x="18" y="18" width="12" height="12" rx="3" fill="#4338ca" />
        <rect x="34" y="18" width="12" height="12" rx="3" fill="#6366f1" />
        <rect x="26" y="34" width="12" height="12" rx="3" fill="#312e81" />
        <path d="M30 24h4M24 30v4M40 30v4M32 30v4" stroke="#e0e7ff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none">
      <circle cx="32" cy="32" r="28" fill="#f59e0b" />
      <circle cx="24" cy="28" r="4.5" fill="#1f2937" />
      <circle cx="40" cy="28" r="4.5" fill="#1f2937" />
      <path d="M22 40c4.5 5 15.5 5 20 0" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
          <section className="hero-panel motion-card mb-6 sm:mb-8">
            <p className="eyebrow">One Stop Interview Practice</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl dark:text-slate-100">
              Crack interviews with structured learning, not random notes.
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-700 sm:mt-4 sm:text-base dark:text-slate-300">
              Every track includes deep explanations, production-level examples,
              and curated interview MCQs so you can revise fast and answer with
              confidence.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="chip">Detailed concept breakdowns</span>
              <span className="chip">Interview Q and A format</span>
              <span className="chip">Interactive MCQ rounds</span>
            </div>
          </section>

          <section className="motion-stagger grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TECHNOLOGIES.map((tech, index) => (
              <Link
                key={tech.name}
                href={tech.href}
                className="content-card home-tech-card group p-4 sm:p-5"
                style={{ "--card-i": index }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full border border-slate-300/80 bg-white/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-300">
                    Interview Track
                  </span>
                  <span className="home-card-mascot">
                    <CardLogo name={tech.name} />
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {tech.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {tech.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                    Open track
                  </p>
                  <span className="home-card-arrow text-xl leading-none text-slate-500 dark:text-slate-300">
                    &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
