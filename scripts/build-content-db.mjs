import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
const contentRoot = join(root, "public", "content");
const outputDir = join(root, "data");
const outputFile = join(outputDir, "content-db.json");

function safeReadJson(path, fallback = null) {
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return fallback;
  }
}

function loadTechnology(tech) {
  const techDir = join(contentRoot, tech);
  const meta = safeReadJson(join(techDir, "meta.json"), {
    title: tech,
    description: "",
  });
  const topicIndex = safeReadJson(join(techDir, "topics", "index.json"), []);
  const quiz = safeReadJson(join(techDir, "quiz.json"), []);

  const topics = topicIndex
    .map((entry, idx) => {
      const fromIndexPath = entry?.file ? join(techDir, entry.file) : null;
      const fallbackPath = join(techDir, "topics", `${entry?.id || `topic-${idx + 1}`}.json`);
      const topic = safeReadJson(fromIndexPath || fallbackPath, null);
      if (!topic) return null;

      return {
        ...topic,
        id: topic.id || entry.id || `topic-${idx + 1}`,
        title: topic.title || entry.title || `Topic ${idx + 1}`,
        category: topic.category || entry.category || "General",
      };
    })
    .filter(Boolean);

  return {
    slug: tech,
    meta,
    topics,
    quiz: Array.isArray(quiz) ? quiz : [],
    topicCount: topics.length,
    quizCount: Array.isArray(quiz) ? quiz.length : 0,
  };
}

function main() {
  const technologies = readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const payload = {
    generatedAt: new Date().toISOString(),
    technologies: technologies.map(loadTechnology),
  };

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputFile, JSON.stringify(payload, null, 2), "utf-8");

  const totalTopics = payload.technologies.reduce((sum, t) => sum + t.topicCount, 0);
  const totalQuiz = payload.technologies.reduce((sum, t) => sum + t.quizCount, 0);
  console.log(`Built data/content-db.json for ${payload.technologies.length} technologies`);
  console.log(`Topics: ${totalTopics}, Quiz Questions: ${totalQuiz}`);
}

main();
