"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import AdminSubnav from "@/components/AdminSubnav";
import { fetchJobs } from "@/lib/adminApiClient";

function formatDate(value) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchJobs()
      .then((data) => {
        if (!active) return;
        setJobs(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Failed to load jobs");
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
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="eyebrow text-amber-600 dark:text-amber-400">
              Admin Panel
            </span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Job Queue Monitor
            </h1>
          </div>
          <FreeModeBanner queueDepth={2} quotaUsed={56} />
          <AdminSubnav />

          <section className="content-card overflow-hidden">
            {loading && (
              <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                Loading jobs...
              </p>
            )}
            {error && (
              <p className="px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
                {error}
              </p>
            )}
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Job ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  !error &&
                  jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-t border-slate-200 dark:border-slate-700"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{job.id}</td>
                    <td className="px-4 py-3">{job.type}</td>
                    <td className="px-4 py-3">{job.status}</td>
                    <td className="px-4 py-3">{job.provider}</td>
                    <td className="px-4 py-3">{job.progress}%</td>
                    <td className="px-4 py-3">{formatDate(job.createdAt)}</td>
                  </tr>
                  ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </>
  );
}
