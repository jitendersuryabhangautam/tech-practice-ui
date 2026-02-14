"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ──────────────────────────── data ──────────────────────────── */

const TRACKS = [
  { name: "JavaScript", icon: "JS", color: "from-yellow-400 to-amber-500", desc: "Closures, async, event loop, prototypes & edge cases" },
  { name: "React", icon: "Re", color: "from-cyan-400 to-sky-500", desc: "Hooks, rendering, performance & architecture patterns" },
  { name: "Next.js", icon: "Nx", color: "from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100", darkText: true, desc: "App Router, SSR/SSG, caching & deployment" },
  { name: "System Design", icon: "SD", color: "from-indigo-400 to-violet-500", desc: "HLD/LLD, case studies, trade-offs & diagrams" },
  { name: "Golang", icon: "Go", color: "from-sky-400 to-blue-500", desc: "Concurrency, channels, interfaces & production patterns" },
  { name: "PostgreSQL", icon: "PG", color: "from-blue-400 to-blue-600", desc: "Indexes, query tuning, transactions & optimization" },
  { name: "Docker", icon: "Dk", color: "from-sky-300 to-cyan-500", desc: "Images, Compose, networking & hardening" },
  { name: "Kubernetes", icon: "K8", color: "from-blue-400 to-indigo-500", desc: "Pods, services, scaling & cluster ops" },
];

const FEATURES = [
  {
    title: "Deep Concept Cards",
    desc: "Every topic broken down into detailed cards with production-level examples, diagrams, and edge-case explanations.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: "Interview Q&A Format",
    desc: "Questions framed exactly how interviewers ask them, with crisp answers you can use in real interviews.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: "Interactive MCQ Quizzes",
    desc: "Timed quiz mode with shuffled questions, instant feedback, explanations, and a study mode to review at your pace.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "AI Prep Chat",
    desc: "Floating chatbot that answers interview questions in real-time, tuned for the technology you're currently studying.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    title: "Admin AI Studio",
    desc: "Generate new topics and quizzes with AI, preview content, and publish — all from a single dashboard.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
  },
  {
    title: "Progress Tracking",
    desc: "Track page views, topic engagement, quiz scores, and chat usage across all your learning sessions.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

const ROADMAP = [
  { title: "Coding Playground", desc: "Run and test code right in the browser with a built-in editor and output panel." },
  { title: "Spaced Repetition", desc: "Smart scheduling that surfaces weak topics at the right intervals for long-term retention." },
  { title: "Mock Interviews", desc: "Timed, full-length mock interview sessions with randomized questions across all tracks." },
  { title: "Community Q&A", desc: "Discuss tricky questions, share explanations, and upvote the best answers from other learners." },
  { title: "Personal Study Plans", desc: "AI-generated study plans tailored to your target role, timeline, and weak areas." },
  { title: "Resume & Profile Builder", desc: "Turn your learning progress into a shareable profile and generate ATS-friendly resumes." },
];

/* ─────────────────────────── component ─────────────────────────── */

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleCTA = () => {
    router.push(isLoggedIn ? "/dashboard" : "/login");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="white">
                <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Tech Revision
            </span>
          </div>
          <button
            onClick={handleCTA}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:shadow-md dark:from-amber-500 dark:to-orange-600"
          >
            {isLoggedIn ? "Go to Dashboard" : "Sign In"}
          </button>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/10" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-500/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-700/50 dark:bg-amber-500/10 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Free &amp; Open Source
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Crack Tech Interviews with
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"> Structured Learning</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
              Stop reading random notes. Every track has deep concept explanations,
              production-level examples, curated MCQs, and an AI chatbot — so you
              revise fast and answer with confidence.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleCTA}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30 dark:shadow-amber-600/20"
              >
                {isLoggedIn ? "Go to Dashboard" : "Sign in to Start Learning"}
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </button>
              <a
                href="#features"
                className="flex items-center gap-1.5 rounded-2xl border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900"
              >
                {"See what's inside"}
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                  <path fillRule="evenodd" d="M8 2a.75.75 0 01.75.75v8.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V2.75A.75.75 0 018 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-6 sm:mt-20 sm:max-w-xl">
            {[
              { value: "8", label: "Tech Tracks" },
              { value: "200+", label: "Interview Topics" },
              { value: "500+", label: "MCQ Questions" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interview Tracks ───────────────────────────────────────────── */}
      <section className="border-t border-slate-100 bg-slate-50/80 py-16 sm:py-24 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Interview Tracks</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              8 technologies. One platform.
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base dark:text-slate-400">
              Each track covers concepts, code examples, interview Q&amp;A, and quizzes.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TRACKS.map((t) => (
              <div
                key={t.name}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-900"
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${t.color} text-xs font-extrabold ${t.darkText ? "text-white dark:text-slate-900" : "text-white"} shadow-sm`}>
                  {t.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">What You Get</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              Everything you need to ace your interviews
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-900"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roadmap / Coming Soon ──────────────────────────────────────── */}
      <section className="border-t border-slate-100 bg-slate-50/80 py-16 sm:py-24 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 dark:border-violet-700/50 dark:bg-violet-500/10 dark:text-violet-400">
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" /><path d="M8 3.25a.75.75 0 01.75.75v3.25H12a.75.75 0 010 1.5H7.25V4A.75.75 0 018 3.25z" /></svg>
              Roadmap
            </div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              {"What's coming next"}
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base dark:text-slate-400">
              {"We're building more tools to make your prep even better."}
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ROADMAP.map((r) => (
              <div
                key={r.title}
                className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 dark:border-slate-700 dark:bg-slate-900/70"
              >
                <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700 dark:bg-violet-500/15 dark:text-violet-400">
                  <svg viewBox="0 0 8 8" className="h-1.5 w-1.5" fill="currentColor"><circle cx="4" cy="4" r="4" /></svg>
                  Planned
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 px-6 py-14 text-center shadow-xl sm:px-12 sm:py-20 dark:from-amber-600 dark:via-orange-600 dark:to-orange-700">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-white/5" />
            </div>
            <div className="relative">
              <h2 className="text-2xl font-extrabold text-white sm:text-4xl">
                Ready to start preparing?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
                Sign in and get instant access to 8 interview tracks, interactive quizzes, an AI chat assistant, and more — completely free.
              </p>
              <button
                onClick={handleCTA}
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-amber-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:bg-slate-900 dark:text-amber-400"
              >
                {isLoggedIn ? "Go to Dashboard" : "Sign in to Continue"}
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                <svg viewBox="0 0 20 20" className="h-3 w-3" fill="white">
                  <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tech Revision Platform</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Built for developers, by developers. Free forever.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
