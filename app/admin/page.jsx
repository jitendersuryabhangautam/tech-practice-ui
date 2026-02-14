"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import AdminGeneratePanel from "@/components/AdminGeneratePanel";
import AdminBudgetDashboard from "@/components/AdminBudgetDashboard";
import UserTrackingPanel from "@/components/UserTrackingPanel";

const TABS = [
  { value: "generate", label: "Generate Content", icon: "GEN" },
  { value: "tracking", label: "User Tracking", icon: "USR" },
  { value: "budget", label: "Budget and Ops", icon: "OPS" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <>
      <Navbar />
      <main className="page-shell mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="eyebrow text-amber-600 dark:text-amber-400">
            Admin Panel
          </span>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            AI Content Management
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Generate topics and quizzes with AI, monitor budgets, and review
            content from one place.
          </p>
        </div>

        <FreeModeBanner queueDepth={2} quotaUsed={54} />

        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-700">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 pb-3 pt-2 text-sm font-medium transition ${
                activeTab === tab.value
                  ? "border-amber-500 text-amber-600 dark:text-amber-400"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "generate" && <AdminGeneratePanel />}
        {activeTab === "tracking" && <UserTrackingPanel />}
        {activeTab === "budget" && <AdminBudgetDashboard />}
      </main>
    </>
  );
}
