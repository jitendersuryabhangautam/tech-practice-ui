"use client";

import { useMemo, useState } from "react";

const MOCK_BUDGET = {
  spent: 12.47,
  budget: 50,
  ratio: 25,
  recommendedModel: "gpt-4o-mini",
};

const MOCK_BREAKDOWN = [
  { operation: "generate_topic", count: 34, tokens: 245000, cost: 5.82 },
  { operation: "generate_quiz", count: 18, tokens: 89000, cost: 2.14 },
  { operation: "chat", count: 156, tokens: 312000, cost: 3.28 },
  { operation: "embed", count: 8, tokens: 48000, cost: 0.96 },
  { operation: "eval", count: 3, tokens: 12000, cost: 0.27 },
];

const MOCK_DAILY_USAGE = [
  { date: "Feb 08", cost: 1.2 },
  { date: "Feb 09", cost: 0.8 },
  { date: "Feb 10", cost: 2.1 },
  { date: "Feb 11", cost: 1.5 },
  { date: "Feb 12", cost: 3.2 },
  { date: "Feb 13", cost: 1.8 },
  { date: "Feb 14", cost: 1.87 },
];

const MOCK_RECENT_JOBS = [
  { id: "job-001", type: "generate_topic", tech: "javascript", title: "Closures", status: "completed", cost: 0.004, time: "3.2s", timestamp: "2 min ago" },
  { id: "job-002", type: "generate_quiz", tech: "react", title: "10 questions", status: "completed", cost: 0.002, time: "2.1s", timestamp: "15 min ago" },
  { id: "job-003", type: "chat", tech: "system-design", title: "URL shortener", status: "completed", cost: 0.001, time: "1.8s", timestamp: "23 min ago" },
  { id: "job-004", type: "generate_topic", tech: "golang", title: "Goroutines", status: "failed", cost: 0, time: "-", timestamp: "1 hr ago" },
  { id: "job-005", type: "embed", tech: "docker", title: "11 topics", status: "completed", cost: 0.001, time: "4.5s", timestamp: "2 hr ago" },
];

const MOCK_AUDIT = [
  { action: "CONTENT_GENERATED", user: "Admin", detail: "JavaScript / Closures", timestamp: "Feb 14, 10:32 AM" },
  { action: "CONTENT_APPROVED", user: "Admin", detail: "React / Server Components", timestamp: "Feb 14, 10:15 AM" },
  { action: "CONTENT_PUBLISHED", user: "System", detail: "3 topics published via CI", timestamp: "Feb 14, 09:00 AM" },
  { action: "BUDGET_WARNING", user: "System", detail: "70% of monthly budget used", timestamp: "Feb 13, 11:45 PM" },
  { action: "GENERATION_REQUESTED", user: "Admin", detail: "System Design / CAP Theorem", timestamp: "Feb 13, 04:22 PM" },
];

const JOB_STATUS_COLORS = {
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  failed: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  running: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  queued: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
};

function StatCard({ label, value, sub, badge }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{badge}</span>
      </div>
      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  );
}

function SimpleBarChart({ data, height = 120 }) {
  const maxCost = Math.max(...data.map((d) => d.cost), 1);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d) => (
        <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">${d.cost.toFixed(1)}</span>
          <div className="w-full rounded-t-md bg-amber-400 dark:bg-amber-500" style={{ height: `${(d.cost / maxCost) * (height - 30)}px`, minHeight: 4 }} />
          <span className="text-[10px] text-slate-400 dark:text-slate-500">{d.date.split(" ")[1]}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminBudgetDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const totals = useMemo(() => {
    const totalCost = MOCK_BREAKDOWN.reduce((sum, item) => sum + item.cost, 0);
    const totalRequests = MOCK_BREAKDOWN.reduce((sum, item) => sum + item.count, 0);
    const totalTokens = MOCK_BREAKDOWN.reduce((sum, item) => sum + item.tokens, 0);
    return { totalCost, totalRequests, totalTokens };
  }, []);

  const remaining = Math.max(0, MOCK_BUDGET.budget - MOCK_BUDGET.spent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">AI Budget and Operations</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor usage, cost, fallback model behavior, and system activity.</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">healthy</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Spent" value={`$${MOCK_BUDGET.spent.toFixed(2)}`} sub={`of $${MOCK_BUDGET.budget}`} badge="USD" />
        <StatCard label="Remaining" value={`$${remaining.toFixed(2)}`} sub={`${100 - MOCK_BUDGET.ratio}% left`} badge="BAL" />
        <StatCard label="Requests" value={totals.totalRequests} sub="topic + quiz + chat" badge="REQ" />
        <StatCard label="Model" value={MOCK_BUDGET.recommendedModel} sub="auto-selected" badge="AI" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">Monthly Budget</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{MOCK_BUDGET.ratio}%</span>
        </div>
        <div className="mt-2.5 h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${MOCK_BUDGET.ratio}%` }} />
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {[
          { value: "overview", label: "Usage Overview" },
          { value: "jobs", label: "Recent Jobs" },
          { value: "audit", label: "Audit Log" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.value
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Daily Spend (Feb 8-14)</h3>
            <SimpleBarChart data={MOCK_DAILY_USAGE} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cost Breakdown by Operation</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <th className="px-4 py-2.5">Operation</th>
                    <th className="px-4 py-2.5">Requests</th>
                    <th className="px-4 py-2.5">Tokens</th>
                    <th className="px-4 py-2.5">Cost</th>
                    <th className="px-4 py-2.5">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_BREAKDOWN.map((row) => (
                    <tr key={row.operation} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300">{row.operation.replace(/_/g, " ")}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.count}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{(row.tokens / 1000).toFixed(0)}K</td>
                      <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-100">${row.cost.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{((row.cost / totals.totalCost) * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Jobs</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {MOCK_RECENT_JOBS.map((job) => (
              <div key={job.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${JOB_STATUS_COLORS[job.status] || JOB_STATUS_COLORS.queued}`}>{job.status}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{job.type.replace(/_/g, " ")}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{job.tech} / {job.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{job.cost > 0 ? `$${job.cost.toFixed(3)}` : "-"}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">{job.time} | {job.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Audit Log</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {MOCK_AUDIT.map((entry, i) => (
              <div key={`${entry.action}-${i}`} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-500 text-[10px] font-bold text-white">
                  {entry.action.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{entry.action.replace(/_/g, " ")}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{entry.detail}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">{entry.user}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">{entry.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
