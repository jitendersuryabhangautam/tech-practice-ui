"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import AdminSubnav from "@/components/AdminSubnav";
import { fetchAdminSettings, saveAdminSettings } from "@/lib/adminApiClient";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    fetchAdminSettings()
      .then((data) => {
        if (!active) return;
        setSettings(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Failed to load settings");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const onSave = async () => {
    if (!settings) return;
    try {
      const updated = await saveAdminSettings(settings);
      setSettings(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message || "Failed to save settings");
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-shell min-h-screen">
        <div className="mx-auto max-w-4xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="eyebrow text-amber-600 dark:text-amber-400">
              Admin Panel
            </span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              AI Mode and Limits
            </h1>
          </div>
          <FreeModeBanner queueDepth={0} quotaUsed={40} />
          <AdminSubnav />

          <section className="content-card p-4 sm:p-6">
            {loading && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Loading settings...
              </p>
            )}
            {error && (
              <p className="mb-3 text-sm text-rose-600 dark:text-rose-300">
                {error}
              </p>
            )}
            {!loading && settings && (
              <>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                  AI Mode
                </span>
                <select
                  value={settings.aiMode}
                  onChange={(event) => update("aiMode", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="free">free</option>
                  <option value="mixed">mixed</option>
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                  Primary Provider
                </span>
                <select
                  value={settings.primary}
                  onChange={(event) => update("primary", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="gemini">gemini</option>
                  <option value="groq">groq</option>
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                  Fallback Provider
                </span>
                <select
                  value={settings.fallback}
                  onChange={(event) => update("fallback", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="groq">groq</option>
                  <option value="gemini">gemini</option>
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                  OpenAI Enabled
                </span>
                <select
                  value={String(settings.openAiEnabled)}
                  onChange={(event) =>
                    update("openAiEnabled", event.target.value === "true")
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="false">false</option>
                  <option value="true">true</option>
                </select>
              </label>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                  Topic/day
                </span>
                <input
                  type="number"
                  value={settings.topicDailyLimit}
                  onChange={(event) =>
                    update("topicDailyLimit", Number(event.target.value))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                  Quiz/day
                </span>
                <input
                  type="number"
                  value={settings.quizDailyLimit}
                  onChange={(event) =>
                    update("quizDailyLimit", Number(event.target.value))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                  Chat/day
                </span>
                <input
                  type="number"
                  value={settings.chatDailyLimit}
                  onChange={(event) =>
                    update("chatDailyLimit", Number(event.target.value))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={onSave}
              className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
            >
              Save Settings
            </button>

            {saved && (
              <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-300">
                Settings saved.
              </p>
            )}
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
