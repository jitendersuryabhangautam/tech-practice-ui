"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "data_source_mode";
const DataSourceContext = createContext();

export function DataSourceProvider({ children }) {
  const [mode, setMode] = useState("db");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "hardcoded" || saved === "db") {
      setMode(saved);
    } else {
      localStorage.setItem(STORAGE_KEY, "db");
    }
    setReady(true);
  }, []);

  const setDataSourceMode = (nextMode) => {
    const normalized = nextMode === "hardcoded" ? "hardcoded" : "db";
    setMode(normalized);
    localStorage.setItem(STORAGE_KEY, normalized);
  };

  return (
    <DataSourceContext.Provider
      value={{ mode, setDataSourceMode, ready }}
    >
      {children}
    </DataSourceContext.Provider>
  );
}

export function useDataSource() {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error("useDataSource must be used within DataSourceProvider");
  }
  return context;
}
