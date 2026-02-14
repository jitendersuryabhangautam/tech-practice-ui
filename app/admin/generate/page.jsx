"use client";

import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import AdminGeneratePanel from "@/components/AdminGeneratePanel";
import AdminSubnav from "@/components/AdminSubnav";

export default function AdminGeneratePage() {
  return (
    <>
      <Navbar />
      <main className="page-shell min-h-screen">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="eyebrow text-amber-600 dark:text-amber-400">
              Admin Panel
            </span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Generate Content
            </h1>
            <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400">
              Generate topic content and quizzes, then route output to review.
            </p>
          </div>
          <FreeModeBanner queueDepth={2} quotaUsed={54} />
          <AdminSubnav />
          <AdminGeneratePanel />
        </div>
      </main>
    </>
  );
}
