"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import AdminSubnav from "@/components/AdminSubnav";
import {
  approveReviewItem,
  fetchReviewItem,
  rejectReviewItem,
} from "@/lib/adminApiClient";

export default function AdminContentDetailPage({ params }) {
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("pending_review");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchReviewItem(params.id)
      .then((data) => {
        if (!active) return;
        setItem(data);
        setStatus(data.status);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Failed to load content item");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.id]);

  const handleApprove = async () => {
    const updated = await approveReviewItem(params.id);
    setItem(updated);
    setStatus(updated.status);
  };

  const handleReject = async () => {
    const updated = await rejectReviewItem(params.id);
    setItem(updated);
    setStatus(updated.status);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-shell min-h-screen">
          <div className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
            <section className="content-card p-6 text-sm text-slate-600 dark:text-slate-300">
              Loading content item...
            </section>
          </div>
        </main>
      </>
    );
  }

  if (!item || error) {
    return (
      <>
        <Navbar />
        <main className="page-shell min-h-screen">
          <div className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
            <section className="content-card p-6">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {error || "Content item not found"}
              </h1>
              <Link
                href="/admin/content"
                className="mt-3 inline-block text-sm font-semibold text-amber-600"
              >
                Back to review list
              </Link>
            </section>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-shell min-h-screen">
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="eyebrow text-amber-600 dark:text-amber-400">
              Admin Review
            </span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              {item.title}
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
              {item.technology} | {item.category} | {item.topicId}
            </p>
          </div>

          <FreeModeBanner queueDepth={2} quotaUsed={59} />
          <AdminSubnav />

          <section className="content-card p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Current Status: {status}
              </span>
              <Link
                href="/admin/content"
                className="text-sm font-semibold text-amber-600 hover:underline"
              >
                Back to list
              </Link>
            </div>

            <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">
              {item.summary}
            </p>

            <div className="mb-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
                Interview Questions: {item.interviewQuestions}
              </div>
              <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
                Exercises: {item.exercises}
              </div>
              <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
                Program Exercises: {item.programExercises}
              </div>
            </div>

            <div className="mb-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                Review Notes
              </h2>
              <textarea
                rows={6}
                placeholder="Add quality notes, factual fixes, and publish conditions."
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleApprove}
                className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => setStatus("pending_review")}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                Regenerate
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
