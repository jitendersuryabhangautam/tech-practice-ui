import { useState, useEffect } from "react";
import { useDataSource } from "@/components/DataSourceProvider";

/**
 * Custom hook to load topic data from granular JSON structure
 * Loads from: /content/{technology}/meta.json, topics/index.json, and individual topic files
 */
export function useTopicDataFromContent(
  technology,
  fallbackData = [],
  fallbackQuiz = [],
  options = {}
) {
  const { mode, ready } = useDataSource();
  const fetchMode = options.fetchMode === "index" ? "index" : "full";
  const [data, setData] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [metadata, setMetadata] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ready) return;

    async function loadContent() {
      setError(null);
      setLoading(true);

      if (mode === "hardcoded") {
        setMetadata({
          title: technology,
          description: "",
        });
        setData(Array.isArray(fallbackData) ? fallbackData : []);
        setQuiz(Array.isArray(fallbackQuiz) ? fallbackQuiz : []);
        setLoading(false);
        return;
      }

      try {
        const url =
          fetchMode === "index"
            ? `/api/learning/content/${technology}/index`
            : `/api/learning/content/${technology}`;
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Failed to load API content for ${technology}`);
        }
        const payload = await response.json();
        setMetadata(payload.meta || { title: "", description: "" });
        setData(payload.topicsByCategory || []);
        setQuiz(payload.quiz || []);

        setLoading(false);
      } catch (err) {
        console.error(`Error loading ${technology} content:`, err);
        setError(err.message);
        setData([]);
        setQuiz([]);
        setMetadata({
          title: technology,
          description: "",
        });
        setLoading(false);
      }
    }

    loadContent();
  }, [technology, fallbackData, fallbackQuiz, mode, ready, fetchMode]);

  return {
    data,
    quiz,
    metadata,
    title: metadata.title,
    description: metadata.description,
    loading,
    error,
  };
}
