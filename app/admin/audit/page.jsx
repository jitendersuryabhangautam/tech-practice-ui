"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import AdminSubnav from "@/components/AdminSubnav";
import { fetchAuditFeed } from "@/lib/adminApiClient";

function formatDate(value) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminAuditPage() {
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchAuditFeed()
      .then((data) => {
        if (!active) return;
        setAudit(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Failed to load audit feed");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="page-shell min-h-screen">
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="eyebrow text-amber-600 dark:text-amber-400">
              Admin Panel
            </span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Audit Trail
            </h1>
          </div>
          <FreeModeBanner queueDepth={1} quotaUsed={43} />
          <AdminSubnav />

          <section className="space-y-3">
            {loading && (
              <div className="content-card p-4 text-sm text-slate-600 dark:text-slate-300">
                Loading audit events...
              </div>
            )}
            {error && (
              <div className="content-card p-4 text-sm text-rose-600 dark:text-rose-300">
                {error}
              </div>
            )}
            {!loading &&
              !error &&
              audit.map((entry) => (
              <article
                key={entry.id}
                className="content-card rounded-lg border border-slate-200 p-4 dark:border-slate-700"
              >
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(entry.createdAt)}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {entry.action}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Actor: {entry.actor}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Entity: {entry.entity}
                </p>
              </article>
              ))}
          </section>
        </div>
      </main>
    </>
  );
}
