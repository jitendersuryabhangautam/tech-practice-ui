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

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
          <section className="hero-panel mb-6 sm:mb-8">
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

          <section className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TECHNOLOGIES.map((tech) => (
              <Link
                key={tech.name}
                href={tech.href}
                className="content-card p-4 transition hover:-translate-y-0.5 sm:p-5"
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {tech.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {tech.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-amber-700 dark:text-amber-300">
                  Open track
                </p>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
