"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";

const TRACKS = [
  { href: "/javascript", title: "JavaScript", desc: "Closures, async, and event loop patterns." },
  { href: "/react", title: "React", desc: "Hooks, rendering, and performance." },
  { href: "/nextjs", title: "Next.js", desc: "App Router, caching, and server/client boundaries." },
  { href: "/system-design", title: "System Design", desc: "HLD/LLD case studies and trade-offs." },
  { href: "/golang", title: "Golang", desc: "Concurrency, channels, and interfaces." },
  { href: "/postgresql", title: "PostgreSQL", desc: "Indexing, query tuning, and transactions." },
  { href: "/docker", title: "Docker", desc: "Images, containers, and deployment basics." },
  { href: "/kubernetes", title: "Kubernetes", desc: "Pods, services, and production operations." },
];

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="page-shell min-h-screen">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <section className="hero-panel mb-5">
            <p className="eyebrow">Dashboard</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
              Welcome to Interview Practice
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base dark:text-slate-300">
              Pick a track and continue your preparation.
            </p>
          </section>

          <FreeModeBanner queueDepth={1} quotaUsed={37} />

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TRACKS.map((track) => (
              <Link
                key={track.href}
                href={track.href}
                className="content-card rounded-xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700"
              >
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {track.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {track.desc}
                </p>
              </Link>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
