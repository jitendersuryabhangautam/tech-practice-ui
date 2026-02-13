import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of data files to convert
const dataFiles = [
  { name: "docker", dataExport: "dockerData", quizExport: "dockerQuiz" },
  {
    name: "kubernetes",
    dataExport: "kubernetesData",
    quizExport: "kubernetesQuiz",
  },
  {
    name: "postgresql",
    dataExport: "postgresqlData",
    quizExport: "postgresqlQuiz",
  },
  {
    name: "javascript",
    dataExport: "javascriptData",
    quizExport: "javascriptQuiz",
  },
  { name: "react", dataExport: "reactData", quizExport: "reactQuiz" },
  { name: "nextjs", dataExport: "nextjsData", quizExport: "nextjsQuiz" },
  { name: "golang", dataExport: "golangData", quizExport: "golangQuiz" },
];

const outputDir = path.join(__dirname, "..", "public", "data");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("🚀 Starting data conversion to JSON...\n");

for (const file of dataFiles) {
  try {
    console.log(`📄 Converting ${file.name}.js...`);

    // Dynamic import of the ES module
    const modulePath = `../data/${file.name}.js`;
    const module = await import(modulePath);

    const data = module[file.dataExport] || [];
    const quiz = module[file.quizExport] || [];

    const jsonData = {
      data,
      quiz,
    };

    // Write to JSON file
    const outputPath = path.join(outputDir, `${file.name}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), "utf8");

    console.log(`✅ Successfully created ${file.name}.json`);

    // Show file size
    const stats = fs.statSync(outputPath);
    console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB\n`);
  } catch (error) {
    console.error(`❌ Error converting ${file.name}:`, error.message);
    console.log("");
  }
}

console.log("✨ Conversion complete!");
