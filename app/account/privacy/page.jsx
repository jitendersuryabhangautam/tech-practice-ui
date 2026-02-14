"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";

export default function AccountPrivacyPage() {
  const [exportRequested, setExportRequested] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);

  return (
    <>
      <Navbar />
      <main className="page-shell min-h-screen">
        <div className="mx-auto max-w-4xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <section className="hero-panel mb-5">
            <p className="eyebrow">Privacy</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
              Data Export and Deletion
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Manage your data lifecycle requests from one place.
            </p>
          </section>

          <FreeModeBanner queueDepth={0} quotaUsed={15} />

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="content-card p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Export My Data
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Generate a downloadable archive of your study history, quizzes,
                and chat interactions.
              </p>
              <button
                type="button"
                onClick={() => setExportRequested(true)}
                className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
              >
                Request Export
              </button>
              {exportRequested && (
                <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-300">
                  Export request submitted.
                </p>
              )}
            </section>

            <section className="content-card p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Delete My Account
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Request permanent account deletion with associated profile,
                progress, and session records.
              </p>
              <button
                type="button"
                onClick={() => setDeleteRequested(true)}
                className="mt-4 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400"
              >
                Request Deletion
              </button>
              {deleteRequested && (
                <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">
                  Deletion request recorded. Confirmation flow pending.
                </p>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
