"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to fetch topic data from JSON files
 * Falls back to provided data if fetch fails
 * @param {string} dataFile - Name of the JSON file (without extension)
 * @param {Array} fallbackData - Array of topic data to use if fetch fails
 * @param {Array} fallbackQuiz - Array of quiz questions to use if fetch fails
 * @returns {Object} { data, quiz, loading, error }
 */
export function useTopicData(dataFile, fallbackData = [], fallbackQuiz = []) {
  const [data, setData] = useState(fallbackData);
  const [quiz, setQuiz] = useState(fallbackQuiz);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/tech-practice-ui";
        const root = `${basePath}/content/${dataFile}`;

        // New structure: per-track meta + quiz + per-topic files
        const [metaRes, quizRes, topicIndexRes] = await Promise.all([
          fetch(`${root}/meta.json`),
          fetch(`${root}/quiz.json`),
          fetch(`${root}/topics/index.json`),
        ]);

        if (!metaRes.ok || !quizRes.ok || !topicIndexRes.ok) {
          throw new Error(`Failed to fetch structured content for ${dataFile}`);
        }

        const [metaJson, quizJson, topicIndexJson] = await Promise.all([
          metaRes.json(),
          quizRes.json(),
          topicIndexRes.json(),
        ]);

        const topicResponses = await Promise.all(
          (topicIndexJson || []).map((item) => fetch(`${root}/${item.file}`))
        );

        if (topicResponses.some((res) => !res.ok)) {
          throw new Error(`Failed to fetch one or more topic files for ${dataFile}`);
        }

        const topicsData = await Promise.all(topicResponses.map((res) => res.json()));
        const quizData = quizJson || [];

        setData(topicsData);
        setQuiz(quizData);
        setTitle(metaJson?.title || "");
        setDescription(metaJson?.description || "");
        setError(null);
      } catch (err) {
        console.warn(
          `Could not load structured content for ${dataFile}, using fallback data:`,
          err.message
        );
        // Use fallback data (already set in useState)
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataFile]);

  return { data, quiz, title, description, loading, error };
}
