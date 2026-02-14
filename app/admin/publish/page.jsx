"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import AdminSubnav from "@/components/AdminSubnav";
import {
  fetchPublishData,
  publishItem,
  rollbackPublishEvent,
} from "@/lib/adminApiClient";

function formatDate(value) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPublishPage() {
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastAction, setLastAction] = useState("");

  const loadPublishData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPublishData();
      setQueue(data.queue || []);
      setHistory(data.history || []);
    } catch (err) {
      setError(err.message || "Failed to load publish data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublishData();
  }, []);

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
              Publish Center
            </h1>
            <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400">
              Publish approved items and rollback recent changes if needed.
            </p>
          </div>

          <FreeModeBanner queueDepth={1} quotaUsed={61} />
          <AdminSubnav />

          {lastAction && (
            <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300">
              {lastAction}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <section className="content-card p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Ready to Publish
              </h2>
              <div className="mt-3 space-y-3">
                {loading && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Loading publish queue...
                  </p>
                )}
                {!loading &&
                  queue.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                  >
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {item.technology}
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          await publishItem(item.id);
                          setLastAction(`Published ${item.title} successfully.`);
                          await loadPublishData();
                        }}
                        className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-amber-400"
                      >
                        Publish
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLastAction(`Queued ${item.title} for another review.`)
                        }
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      >
                        Send Back to Review
                      </button>
                    </div>
                  </article>
                  ))}
                {!loading && !queue.length && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No approved content pending publish.
                  </p>
                )}
              </div>
            </section>

            <section className="content-card p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Publish History
              </h2>
              <div className="mt-3 space-y-3">
                {error && (
                  <p className="text-sm text-rose-600 dark:text-rose-300">
                    {error}
                  </p>
                )}
                {!error &&
                  history.map((entry) => (
                  <article
                    key={entry.id}
                    className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(entry.timestamp)} | {entry.type}
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {entry.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {entry.status}
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          await rollbackPublishEvent(entry.id);
                          setLastAction(
                            `Rollback triggered for ${entry.title} (${entry.rollbackRef}).`
                          );
                          await loadPublishData();
                        }}
                        className="rounded-md border border-rose-300 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:border-rose-700 dark:text-rose-300"
                      >
                        Rollback
                      </button>
                    </div>
                  </article>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
