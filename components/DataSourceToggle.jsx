"use client";

import { useDataSource } from "@/components/DataSourceProvider";

export default function DataSourceToggle() {
  const { mode, setDataSourceMode, ready } = useDataSource();

  if (!ready) return null;

  return (
    <div className="fixed bottom-36 right-3 z-50 rounded-lg border border-slate-300 bg-white p-1 shadow-lg sm:bottom-auto sm:right-4 sm:top-32 dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Data Source
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setDataSourceMode("db")}
          className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
            mode === "db"
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          DB API
        </button>
        <button
          type="button"
          onClick={() => setDataSourceMode("hardcoded")}
          className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
            mode === "hardcoded"
              ? "bg-amber-500 text-slate-900"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          Hardcoded
        </button>
      </div>
    </div>
  );
}
