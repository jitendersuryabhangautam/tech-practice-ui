const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "public", "content");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadJsData(filePath, exportNames) {
  const source = fs.readFileSync(filePath, "utf8");
  const transformed = source.replace(/export const\s+/g, "const ");
  const body = `${transformed}\nreturn { ${exportNames.join(", ")} };`;
  return new Function(body)();
}

function flattenTopics(topicsOrSections) {
  if (!Array.isArray(topicsOrSections)) {
    return [];
  }
  if (!topicsOrSections[0]?.topics) {
    return topicsOrSections.map((topic) => ({
      ...topic,
      category: topic.category || "Core Concepts",
    }));
  }
  return topicsOrSections.flatMap((section) =>
    (section.topics || []).map((topic) => ({
      ...topic,
      category: section.category || topic.category || "Core Concepts",
    }))
  );
}

function toFileSafe(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function writeTrack({ track, title, description, topics, quiz }) {
  const trackRoot = path.join(CONTENT_ROOT, track);
  const topicsRoot = path.join(trackRoot, "topics");
  ensureDir(topicsRoot);

  fs.writeFileSync(
    path.join(trackRoot, "meta.json"),
    JSON.stringify({ title, description }, null, 2)
  );
  fs.writeFileSync(
    path.join(trackRoot, "quiz.json"),
    JSON.stringify(quiz || [], null, 2)
  );

  const flattened = flattenTopics(topics);
  const index = flattened.map((topic, i) => {
    const topicId = topic.id || `${track}-${i + 1}`;
    const fileName = `${toFileSafe(topicId)}.json`;
    fs.writeFileSync(
      path.join(topicsRoot, fileName),
      JSON.stringify({ ...topic, id: topicId }, null, 2)
    );
    return {
      id: topicId,
      file: `topics/${fileName}`,
      title: topic.title || topicId,
      category: topic.category || "Core Concepts",
    };
  });

  fs.writeFileSync(
    path.join(trackRoot, "topics", "index.json"),
    JSON.stringify(index, null, 2)
  );

  console.log(`Exported ${track}: ${flattened.length} topics, ${quiz?.length || 0} quiz`);
}

function main() {
  ensureDir(CONTENT_ROOT);

  const javascript = readJson(path.join(ROOT, "public", "data", "javascript.json"));
  writeTrack({
    track: "javascript",
    title: javascript.title,
    description: javascript.description,
    topics: javascript.topics,
    quiz: javascript.quiz,
  });

  const react = readJson(path.join(ROOT, "public", "data", "react.json"));
  writeTrack({
    track: "react",
    title: react.title,
    description: react.description,
    topics: react.topics,
    quiz: react.quiz,
  });

  const { nextjsData, nextjsQuiz } = loadJsData(
    path.join(ROOT, "data", "nextjs.js"),
    ["nextjsData", "nextjsQuiz"]
  );
  writeTrack({
    track: "nextjs",
    title: "Next.js Interview Preparation",
    description:
      "Master App Router, rendering strategies, caching, APIs, and production patterns asked in modern interviews.",
    topics: nextjsData,
    quiz: nextjsQuiz,
  });

  const { dockerData, dockerQuiz } = loadJsData(
    path.join(ROOT, "data", "docker.js"),
    ["dockerData", "dockerQuiz"]
  );
  writeTrack({
    track: "docker",
    title: "Docker Interview Preparation",
    description:
      "Learn how to answer Docker interview questions on images, containers, networking, security, and debugging with real commands.",
    topics: dockerData,
    quiz: dockerQuiz,
  });

  const { kubernetesData, kubernetesQuiz } = loadJsData(
    path.join(ROOT, "data", "kubernetes.js"),
    ["kubernetesData", "kubernetesQuiz"]
  );
  writeTrack({
    track: "kubernetes",
    title: "Kubernetes Interview Preparation",
    description:
      "Cover Kubernetes architecture, workloads, networking, and operational troubleshooting in an interview-first format.",
    topics: kubernetesData,
    quiz: kubernetesQuiz,
  });

  const { golangData, golangQuiz } = loadJsData(
    path.join(ROOT, "data", "golang.js"),
    ["golangData", "golangQuiz"]
  );
  const { golangExtraData, golangExtraQuiz } = loadJsData(
    path.join(ROOT, "data", "golang_extra.js"),
    ["golangExtraData", "golangExtraQuiz"]
  );
  writeTrack({
    track: "golang",
    title: "Golang Interview Preparation",
    description:
      "Prepare for backend interviews with Go fundamentals, concurrency models, data structures, and production practices.",
    topics: [...golangData, ...golangExtraData],
    quiz: [...golangQuiz, ...golangExtraQuiz],
  });

  const { postgresqlData, postgresqlQuiz } = loadJsData(
    path.join(ROOT, "data", "postgresql.js"),
    ["postgresqlData", "postgresqlQuiz"]
  );
  writeTrack({
    track: "postgresql",
    title: "PostgreSQL Interview Preparation",
    description:
      "Build confidence in SQL, indexing, optimization, transactions, and schema design with interview-ready explanations.",
    topics: postgresqlData,
    quiz: postgresqlQuiz,
  });
}

main();
