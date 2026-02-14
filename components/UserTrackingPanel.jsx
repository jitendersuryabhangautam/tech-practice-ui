"use client";

import { useMemo, useState } from "react";

const MOCK_OVERVIEW = {
  totalUsers: 142,
  activeToday: 38,
  avgSessionMin: 14.2,
  totalPageViews: 4821,
  quizzesTaken: 312,
  chatMessages: 1045,
};

const MOCK_PAGE_VIEWS = [
  { tech: "JavaScript", views: 1420, sessions: 98, avgTime: "6m 12s", color: "bg-amber-400" },
  { tech: "React", views: 1085, sessions: 74, avgTime: "5m 40s", color: "bg-sky-400" },
  { tech: "Next.js", views: 612, sessions: 45, avgTime: "4m 55s", color: "bg-slate-500" },
  { tech: "Golang", views: 520, sessions: 38, avgTime: "7m 10s", color: "bg-cyan-400" },
  { tech: "PostgreSQL", views: 402, sessions: 31, avgTime: "5m 20s", color: "bg-indigo-400" },
  { tech: "Docker", views: 380, sessions: 28, avgTime: "4m 30s", color: "bg-blue-400" },
  { tech: "Kubernetes", views: 252, sessions: 19, avgTime: "6m 05s", color: "bg-violet-400" },
  { tech: "System Design", views: 150, sessions: 12, avgTime: "8m 15s", color: "bg-rose-400" },
];

const MOCK_TOPIC_ENGAGEMENT = [
  { topic: "Closures and Scope", tech: "JavaScript", completions: 78, avgScore: 85, bookmarks: 34 },
  { topic: "Hooks Deep Dive", tech: "React", completions: 65, avgScore: 79, bookmarks: 28 },
  { topic: "Goroutines", tech: "Golang", completions: 52, avgScore: 72, bookmarks: 22 },
  { topic: "SSR vs SSG", tech: "Next.js", completions: 48, avgScore: 81, bookmarks: 19 },
  { topic: "Joins and Indexes", tech: "PostgreSQL", completions: 45, avgScore: 68, bookmarks: 17 },
];

const MOCK_QUIZ_STATS = [
  { tech: "JavaScript", attempts: 95, avgScore: 78, passRate: 82 },
  { tech: "React", attempts: 72, avgScore: 74, passRate: 79 },
  { tech: "Next.js", attempts: 41, avgScore: 71, passRate: 75 },
  { tech: "Golang", attempts: 38, avgScore: 69, passRate: 72 },
  { tech: "PostgreSQL", attempts: 28, avgScore: 65, passRate: 68 },
  { tech: "Docker", attempts: 22, avgScore: 73, passRate: 77 },
  { tech: "Kubernetes", attempts: 16, avgScore: 66, passRate: 70 },
];

const MOCK_DAILY_ACTIVE = [
  { date: "Mon", users: 28 },
  { date: "Tue", users: 35 },
  { date: "Wed", users: 42 },
  { date: "Thu", users: 38 },
  { date: "Fri", users: 31 },
  { date: "Sat", users: 18 },
  { date: "Sun", users: 22 },
];

const MOCK_ACTIVITY_FEED = [
  { user: "Aarav S.", action: "Completed quiz", detail: "JavaScript - 9/10", time: "2 min ago", type: "quiz" },
  { user: "Priya M.", action: "Viewed topic", detail: "React / Hooks Deep Dive", time: "5 min ago", type: "view" },
  { user: "Sam K.", action: "Chat session", detail: "3 messages about Docker volumes", time: "8 min ago", type: "chat" },
  { user: "Riya D.", action: "Completed topic", detail: "Golang / Goroutines", time: "12 min ago", type: "complete" },
];

const MOCK_CHAT_USAGE = {
  totalSessions: 284,
  totalMessages: 1045,
  avgPerSession: 3.7,
  topTechnologies: [
    { tech: "JavaScript", sessions: 82 },
    { tech: "React", sessions: 64 },
    { tech: "System Design", sessions: 45 },
    { tech: "Golang", sessions: 38 },
    { tech: "Docker", sessions: 27 },
    { tech: "Others", sessions: 28 },
  ],
};

const ACTIVITY_STYLES = {
  quiz: { dot: "bg-amber-500", label: "text-amber-700 dark:text-amber-400" },
  view: { dot: "bg-sky-500", label: "text-sky-700 dark:text-sky-400" },
  chat: { dot: "bg-violet-500", label: "text-violet-700 dark:text-violet-400" },
  complete: { dot: "bg-emerald-500", label: "text-emerald-700 dark:text-emerald-400" },
  bookmark: { dot: "bg-rose-500", label: "text-rose-700 dark:text-rose-400" },
};

const SUBTABS = [
  { value: "overview", label: "Overview" },
  { value: "engagement", label: "Engagement" },
  { value: "quizzes", label: "Quiz Stats" },
  { value: "chat", label: "Chat Usage" },
];

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

function HorizontalBar({ items, maxValue, valueKey, labelKey, colorKey }) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item[labelKey]} className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-right text-xs font-medium text-slate-600 dark:text-slate-400">{item[labelKey]}</span>
          <div className="flex-1">
            <div className="h-5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className={`h-full rounded-full transition-all ${item[colorKey] || "bg-amber-400 dark:bg-amber-500"}`}
                style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
              />
            </div>
          </div>
          <span className="w-12 text-xs font-semibold text-slate-700 dark:text-slate-300">{item[valueKey].toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function DailyBarChart({ data }) {
  const maxUsers = Math.max(...data.map((d) => d.users));
  return (
    <div className="flex items-end justify-between gap-2 px-2">
      {data.map((day) => (
        <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">{day.users}</span>
          <div className="w-full rounded-t-md bg-amber-400 dark:bg-amber-500" style={{ height: `${Math.max((day.users / maxUsers) * 100, 8)}px`, minHeight: "8px" }} />
          <span className="text-[10px] text-slate-500 dark:text-slate-400">{day.date}</span>
        </div>
      ))}
    </div>
  );
}

export default function UserTrackingPanel() {
  const [subTab, setSubTab] = useState("overview");
  const sortedEngagement = useMemo(() => [...MOCK_TOPIC_ENGAGEMENT].sort((a, b) => b.completions - a.completions), []);

  const maxPageViews = Math.max(...MOCK_PAGE_VIEWS.map((p) => p.views));
  const totalQuizAttempts = MOCK_QUIZ_STATS.reduce((sum, item) => sum + item.attempts, 0);
  const avgQuizScore = Math.round(MOCK_QUIZ_STATS.reduce((sum, item) => sum + item.avgScore * item.attempts, 0) / totalQuizAttempts);

  return (
    <div className="space-y-6">
      <div className="flex gap-1.5 overflow-x-auto">
        {SUBTABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSubTab(tab.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              subTab === tab.value
                ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Total Users" value={MOCK_OVERVIEW.totalUsers.toLocaleString()} sub="All-time registered" badge="USR" />
            <StatCard label="Active Today" value={MOCK_OVERVIEW.activeToday} sub={`${((MOCK_OVERVIEW.activeToday / MOCK_OVERVIEW.totalUsers) * 100).toFixed(0)}% of total`} badge="ACT" />
            <StatCard label="Avg Session" value={`${MOCK_OVERVIEW.avgSessionMin}m`} sub="Average time on site" badge="TIME" />
            <StatCard label="Page Views" value={MOCK_OVERVIEW.totalPageViews.toLocaleString()} sub="Last 30 days" badge="VIEW" />
            <StatCard label="Quizzes" value={MOCK_OVERVIEW.quizzesTaken} sub="Last 30 days" badge="QUIZ" />
            <StatCard label="Chat Messages" value={MOCK_OVERVIEW.chatMessages.toLocaleString()} sub="Last 30 days" badge="CHAT" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Daily Active Users (This Week)</h3>
              <DailyBarChart data={MOCK_DAILY_ACTIVE} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Page Views by Technology</h3>
              <HorizontalBar items={MOCK_PAGE_VIEWS} maxValue={maxPageViews} valueKey="views" labelKey="tech" colorKey="color" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent User Activity</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {MOCK_ACTIVITY_FEED.map((item, i) => {
                const style = ACTIVITY_STYLES[item.type] || ACTIVITY_STYLES.view;
                return (
                  <div key={`${item.user}-${i}`} className="flex items-start gap-3 px-4 py-3">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{item.user}</span>{" "}
                        <span className={`font-medium ${style.label}`}>{item.action}</span>
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{item.detail}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">{item.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {subTab === "engagement" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Technology Engagement</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <th className="px-4 py-2.5">Technology</th>
                    <th className="px-4 py-2.5">Page Views</th>
                    <th className="px-4 py-2.5">Sessions</th>
                    <th className="px-4 py-2.5">Avg Time</th>
                    <th className="px-4 py-2.5">Popularity</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PAGE_VIEWS.map((row) => (
                    <tr key={row.tech} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300">{row.tech}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.views.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.sessions}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.avgTime}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{((row.views / MOCK_OVERVIEW.totalPageViews) * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Top Topics by Completion</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <th className="px-4 py-2.5">Topic</th>
                    <th className="px-4 py-2.5">Technology</th>
                    <th className="px-4 py-2.5">Completions</th>
                    <th className="px-4 py-2.5">Avg Score</th>
                    <th className="px-4 py-2.5">Bookmarks</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEngagement.map((row) => (
                    <tr key={`${row.tech}-${row.topic}`} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300">{row.topic}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.tech}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.completions}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.avgScore}%</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.bookmarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === "quizzes" && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Total Attempts" value={totalQuizAttempts} sub="Across all technologies" badge="QUIZ" />
            <StatCard label="Avg Score" value={`${avgQuizScore}%`} sub="Weighted average" badge="SCORE" />
            <StatCard label="Overall Pass Rate" value={`${Math.round(MOCK_QUIZ_STATS.reduce((sum, item) => sum + item.passRate * item.attempts, 0) / totalQuizAttempts)}%`} sub="Score >= 70%" badge="PASS" />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quiz Performance by Technology</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <th className="px-4 py-2.5">Technology</th>
                    <th className="px-4 py-2.5">Attempts</th>
                    <th className="px-4 py-2.5">Avg Score</th>
                    <th className="px-4 py-2.5">Pass Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_QUIZ_STATS.map((row) => (
                    <tr key={row.tech} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300">{row.tech}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.attempts}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.avgScore}%</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.passRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === "chat" && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Total Sessions" value={MOCK_CHAT_USAGE.totalSessions} sub="AI chat conversations" badge="CHAT" />
            <StatCard label="Total Messages" value={MOCK_CHAT_USAGE.totalMessages.toLocaleString()} sub="User + AI messages" badge="MSG" />
            <StatCard label="Avg per Session" value={MOCK_CHAT_USAGE.avgPerSession} sub="Messages per session" badge="AVG" />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Chat Sessions by Technology</h3>
            <HorizontalBar
              items={MOCK_CHAT_USAGE.topTechnologies}
              maxValue={Math.max(...MOCK_CHAT_USAGE.topTechnologies.map((item) => item.sessions))}
              valueKey="sessions"
              labelKey="tech"
              colorKey="color"
            />
          </div>
        </div>
      )}
    </div>
  );
}
