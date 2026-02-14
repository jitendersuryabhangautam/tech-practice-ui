"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import AdminSubnav from "@/components/AdminSubnav";
import { fetchReviewItems } from "@/lib/adminApiClient";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending_review", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminContentPage() {
  const [status, setStatus] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchReviewItems(status)
      .then((data) => {
        if (!active) return;
        setItems(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Failed to load review items");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status]);

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
              Content Review Inbox
            </h1>
            <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400">
              Review generated topics and quizzes before publish.
            </p>
          </div>

          <FreeModeBanner queueDepth={2} quotaUsed={57} />
          <AdminSubnav />

          <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatus(filter.value)}
                className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                  status === filter.value
                    ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                    : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <section className="space-y-3">
            {loading && (
              <div className="content-card p-4 text-sm text-slate-600 dark:text-slate-300">
                Loading review items...
              </div>
            )}
            {error && (
              <div className="content-card border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
                {error}
              </div>
            )}
            {!loading &&
              !error &&
              items.map((item) => (
              <article
                key={item.id}
                className="content-card rounded-xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {item.technology} | {item.category}
                    </p>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {item.summary}
                    </p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      IQ: {item.interviewQuestions} | EX: {item.exercises} | PRG:{" "}
                      {item.programExercises}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item.status}
                    </span>
                    <Link
                      href={`/admin/content/${item.id}`}
                      className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-amber-400"
                    >
                      Review Item
                    </Link>
                  </div>
                </div>
              </article>
              ))}
          </section>
        </div>
      </main>
    </>
  );
}
