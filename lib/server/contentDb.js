import { readFileSync } from "fs";
import { join } from "path";

let cache = null;

function loadDb() {
  if (cache) return cache;
  const filePath = join(process.cwd(), "data", "content-db.json");
  const raw = readFileSync(filePath, "utf-8");
  cache = JSON.parse(raw);
  return cache;
}

function groupTopicsByCategory(topics) {
  const grouped = {};
  topics.forEach((topic) => {
    const category = topic.category || "General";
    if (!grouped[category]) {
      grouped[category] = { category, topics: [] };
    }
    grouped[category].topics.push(topic);
  });
  return Object.values(grouped);
}

export function getTechnologiesSummary() {
  const db = loadDb();
  return db.technologies.map((tech) => ({
    slug: tech.slug,
    title: tech.meta?.title || tech.slug,
    description: tech.meta?.description || "",
    topicCount: tech.topicCount || tech.topics?.length || 0,
    quizCount: tech.quizCount || tech.quiz?.length || 0,
  }));
}

export function getTechnologyContent(techSlug) {
  const db = loadDb();
  const technology = db.technologies.find((tech) => tech.slug === techSlug);
  if (!technology) return null;
  return {
    meta: technology.meta || { title: techSlug, description: "" },
    topicsByCategory: groupTopicsByCategory(technology.topics || []),
    quiz: technology.quiz || [],
  };
}

export function getTopicById(techSlug, topicId) {
  const db = loadDb();
  const technology = db.technologies.find((tech) => tech.slug === techSlug);
  if (!technology) return null;
  return (technology.topics || []).find((topic) => topic.id === topicId) || null;
}
