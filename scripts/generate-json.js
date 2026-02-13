// Simple JSON converter for tech content
// This extracts JS exports and converts them to JSON files
const fs = require("fs");
const path = require("path");

const technologies = [
  { file: "docker", dataExport: "dockerData", quizExport: "dockerQuiz" },
  {
    file: "kubernetes",
    dataExport: "kubernetesData",
    quizExport: "kubernetesQuiz",
  },
  {
    file: "postgresql",
    dataExport: "postgresqlData",
    quizExport: "postgresqlQuiz",
  },
  { file: "nextjs", dataExport: "nextjsData", quizExport: "nextjsQuiz" },
  { file: "golang", dataExport: "golangData", quizExport: "golangQuiz" },
];

function findArrayContent(content, exportName) {
  const regex = new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*\\[`);
  const match = content.match(regex);

  if (!match) return null;

  let start = match.index + match[0].length - 1; // Include the opening [
  let depth = 0;
  let inString = false;
  let stringChar = "";
  let escaped = false;

  for (let i = start; i < content.length; i++) {
    const char = content[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\" && inString) {
      escaped = true;
      continue;
    }

    if ((char === '"' || char === "'" || char === "`") && !inString) {
      inString = true;
      stringChar = char;
    } else if (char === stringChar && inString && !escaped) {
      inString = false;
    }

    if (!inString) {
      if (char === "[") depth++;
      if (char === "]") {
        depth--;
        if (depth === 0) {
          return content.substring(start, i + 1);
        }
      }
    }
  }

  return null;
}

console.log("Converting JS data files to JSON...\n");

for (const tech of technologies) {
  try {
    const dataPath = path.join(__dirname, "..", "data", `${tech.file}.js`);
    const outputPath = path.join(
      __dirname,
      "..",
      "public",
      "data",
      `${tech.file}.json`
    );

    console.log(`Processing ${tech.file}...`);

    const content = fs.readFileSync(dataPath, "utf8");

    const dataArrayStr = findArrayContent(content, tech.dataExport);
    const quizArrayStr = findArrayContent(content, tech.quizExport);

    if (!dataArrayStr || !quizArrayStr) {
      console.error(`  ✗ Failed to extract arrays from ${tech.file}.js`);
      continue;
    }

    // Use eval to convert JS arrays to native objects
    /* eslint-disable no-eval */
    const data = eval(`(${dataArrayStr})`);
    const quiz = eval(`(${quizArrayStr})`);
    /* eslint-enable no-eval */

    const json = { data, quiz };

    fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
    const size = (fs.statSync(outputPath).size / 1024).toFixed(1);
    console.log(`  ✓ Created ${tech.file}.json (${size} KB)`);
  } catch (error) {
    console.error(`  ✗ Error with ${tech.file}:`, error.message);
  }
}

console.log("\n✓ All conversions complete!");
