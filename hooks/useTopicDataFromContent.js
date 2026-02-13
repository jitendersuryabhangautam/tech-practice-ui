import { useState, useEffect } from "react";

/**
 * Custom hook to load topic data from granular JSON structure
 * Loads from: /content/{technology}/meta.json, topics/index.json, and individual topic files
 */
export function useTopicDataFromContent(
  technology,
  fallbackData = [],
  fallbackQuiz = []
) {
  const [data, setData] = useState(fallbackData);
  const [quiz, setQuiz] = useState(fallbackQuiz);
  const [metadata, setMetadata] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
        const contentBase = `${basePath}/content/${technology}`;

        // Load metadata
        const metaResponse = await fetch(`${contentBase}/meta.json`);
        if (metaResponse.ok) {
          const metaData = await metaResponse.json();
          setMetadata(metaData);
        }

        // Load topic index
        const indexResponse = await fetch(`${contentBase}/topics/index.json`);
        if (!indexResponse.ok) {
          throw new Error(`Failed to load topic index for ${technology}`);
        }
        const topicIndex = await indexResponse.json();

        // Load all individual topic files
        const topicPromises = topicIndex.map(async (topicMeta) => {
          const topicResponse = await fetch(`${contentBase}/${topicMeta.file}`);
          if (topicResponse.ok) {
            return await topicResponse.json();
          }
          return null;
        });

        const topics = await Promise.all(topicPromises);
        const validTopics = topics.filter((t) => t !== null);

        // Group topics by category
        const grouped = {};
        validTopics.forEach((topic) => {
          const category = topic.category || "General";
          if (!grouped[category]) {
            grouped[category] = { category, topics: [] };
          }
          grouped[category].topics.push(topic);
        });

        setData(Object.values(grouped));

        // Load quiz
        const quizResponse = await fetch(`${contentBase}/quiz.json`);
        if (quizResponse.ok) {
          const quizData = await quizResponse.json();
          setQuiz(quizData);
        }

        setLoading(false);
      } catch (err) {
        console.error(`Error loading ${technology} content:`, err);
        setError(err.message);
        // Fall back to provided data
        setData(fallbackData);
        setQuiz(fallbackQuiz);
        setLoading(false);
      }
    }

    loadContent();
  }, [technology, fallbackData, fallbackQuiz]);

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
