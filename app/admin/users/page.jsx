"use client";

import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import UserTrackingPanel from "@/components/UserTrackingPanel";
import AdminSubnav from "@/components/AdminSubnav";

export default function AdminUsersPage() {
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
              User Tracking
            </h1>
            <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400">
              Monitor engagement, quiz behavior, and chat usage.
            </p>
          </div>
          <FreeModeBanner queueDepth={1} quotaUsed={47} />
          <AdminSubnav />
          <UserTrackingPanel />
        </div>
      </main>
    </>
  );
}
