// scripts/validate-postgresql-content.mjs
// Validates PostgreSQL queries against the canonical e-commerce schema

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the canonical schema
const SCHEMA = {
  users: [
    "id",
    "first_name",
    "last_name",
    "email",
    "role",
    "created_at",
    "updated_at",
  ],
  products: [
    "id",
    "name",
    "sku",
    "price",
    "stock_quantity",
    "category",
    "image_url",
    "created_at",
    "updated_at",
  ],
  orders: [
    "id",
    "order_number",
    "user_id",
    "total_amount",
    "status",
    "payment_method",
    "shipping_address",
    "billing_address",
    "created_at",
    "updated_at",
  ],
  order_items: ["id", "order_id", "product_id", "quantity", "price_at_time"],
  payments: [
    "id",
    "order_id",
    "amount",
    "payment_method",
    "status",
    "transaction_id",
    "created_at",
  ],
  returns: [
    "id",
    "order_id",
    "reason",
    "status",
    "refund_amount",
    "created_at",
  ],
  carts: ["id", "user_id", "created_at", "updated_at"],
  cart_items: ["id", "cart_id", "product_id", "quantity"],
  stock_reservations: ["id", "product_id", "quantity", "expires_at"],
};

// Invalid column patterns that should NOT appear in queries
const INVALID_PATTERNS = [
  {
    pattern: /\busers\.name\b/gi,
    message: "users.name - should use first_name/last_name or CONCAT_WS()",
  },
  {
    pattern: /\bSELECT\s+u\.name\b/gi,
    message:
      "SELECT u.name - should use CONCAT_WS(' ', u.first_name, u.last_name)",
  },
  {
    pattern: /\boi\.price\b(?!_at_time)/gi,
    message: "order_items.price (oi.price) - should be price_at_time",
  },
  {
    pattern: /\border_items\.price\b(?!_at_time)/gi,
    message: "order_items.price - should be price_at_time",
  },
  {
    pattern: /\bdeleted_at\b/gi,
    message: "deleted_at - column does not exist in schema",
  },
  {
    pattern: /\bshipped_at\b/gi,
    message: "shipped_at - column does not exist in schema",
  },
  {
    pattern: /\bdelivered_at\b/gi,
    message: "delivered_at - column does not exist in schema",
  },
  {
    pattern: /\bcompleted_at\b/gi,
    message: "completed_at - column does not exist in schema",
  },
  {
    pattern: /\bpayment_type\b/gi,
    message: "payment_type - should be payment_method",
  },
  {
    pattern: /\bcarts\.status\b/gi,
    message: "carts.status - column does not exist in schema",
  },
  {
    pattern: /payment_method\s*=\s*['"]COD['"]/g,
    message: "payment_method = 'COD' - should use lowercase 'cod'",
  },
  {
    pattern: /payment_method\s*=\s*['"]CARD['"]/g,
    message: "payment_method = 'CARD' - should use lowercase 'card'",
  },
  {
    pattern: /status\s*=\s*['"]ACTIVE['"]/g,
    message: "status = 'ACTIVE' - should use lowercase 'active'",
  },
];

/**
 * Validate a single SQL query
 * @param {string} query - The SQL query to validate
 * @param {number} exerciseNum - The exercise number
 * @returns {Array} Array of error objects
 */
function validateQuery(query, exerciseNum, topic) {
  const errors = [];

  // Check for invalid column patterns
  for (const { pattern, message } of INVALID_PATTERNS) {
    const matches = query.match(pattern);
    if (matches) {
      errors.push({
        severity: "error",
        exerciseNum,
        topic,
        message: `Uses invalid pattern: ${message}`,
        matches: [...new Set(matches)], // Remove duplicates
      });
    }
  }

  return errors;
}

/**
 * Validate the schema definition in the code field
 * @param {string} schemaCode - The schema SQL
 * @returns {Array} Array of errors
 */
function validateSchemaDefinition(schemaCode) {
  const errors = [];

  // Check if users table has first_name and last_name
  if (schemaCode.includes("users") && !schemaCode.includes("first_name")) {
    errors.push({
      severity: "error",
      message:
        "Schema definition: users table should have first_name and last_name columns, not just name",
    });
  }

  // Check if order_items has price_at_time
  if (
    schemaCode.includes("order_items") &&
    !schemaCode.includes("price_at_time")
  ) {
    errors.push({
      severity: "error",
      message:
        "Schema definition: order_items table should have price_at_time column, not just price",
    });
  }

  // Check if order_items table exists
  if (!schemaCode.includes("order_items")) {
    errors.push({
      severity: "error",
      message: "Schema definition: order_items table is missing",
    });
  }

  return errors;
}

/**
 * Validate a single topic file
 */
function validateTopicFile(filePath) {
  const errors = [];

  if (!fs.existsSync(filePath)) {
    return [{ severity: "error", message: `File not found: ${filePath}` }];
  }

  let content;
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    content = JSON.parse(fileContent);
  } catch (error) {
    return [
      { severity: "error", message: `Failed to parse JSON: ${error.message}` },
    ];
  }

  // Validate required fields
  if (!content.id || !content.title) {
    errors.push({
      severity: "error",
      message: "Topic must include id and title",
    });
  }

  // Validate schema definition if exists
  if (content.code) {
    const schemaErrors = validateSchemaDefinition(content.code);
    errors.push(...schemaErrors);
  }

  // Validate exercises
  if (content.exercises && Array.isArray(content.exercises)) {
    content.exercises.forEach((exercise, idx) => {
      const exerciseNum = idx + 1;
      const query = exercise.answer || "";
      const topic = exercise.topic || "Unknown";

      // Validate query
      const queryErrors = validateQuery(query, exerciseNum, topic);
      errors.push(...queryErrors);
    });
  }

  return errors;
}

/**
 * Main validation function
 */
async function validatePostgreSQLContent() {
  console.log("🔍 Validating PostgreSQL content...\n");

  const root = process.cwd();
  const topicsIndexPath = path.join(
    root,
    "public",
    "content",
    "postgresql",
    "topics",
    "index.json"
  );

  if (!fs.existsSync(topicsIndexPath)) {
    console.error(`❌ Index file not found: ${topicsIndexPath}`);
    process.exit(1);
  }

  let index;
  try {
    const indexContent = fs.readFileSync(topicsIndexPath, "utf8");
    index = JSON.parse(indexContent);
  } catch (error) {
    console.error(`❌ Failed to parse index.json: ${error.message}`);
    process.exit(1);
  }

  const allErrors = [];
  let totalExercises = 0;
  let filesValidated = 0;

  // Validate all topic files from index
  for (const entry of index) {
    const filePath = path.join(
      root,
      "public",
      "content",
      "postgresql",
      entry.file
    );

    if (!fs.existsSync(filePath)) {
      allErrors.push({
        severity: "error",
        file: entry.file,
        message: `Missing topic file for ${entry.id}`,
      });
      continue;
    }

    filesValidated++;
    const topicErrors = validateTopicFile(filePath);

    // Read file to count exercises
    try {
      const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (content.exercises) {
        totalExercises += content.exercises.length;
      }
    } catch (e) {
      // Already handled in validateTopicFile
    }

    topicErrors.forEach((err) => {
      allErrors.push({ ...err, file: entry.file });
    });
  }

  // Print results
  console.log(`📊 Validation Results:\n`);
  console.log(`   Files validated: ${filesValidated}`);
  console.log(`   Total exercises: ${totalExercises}`);
  console.log(`   Errors found: ${allErrors.length}\n`);

  // Print errors
  if (allErrors.length > 0) {
    console.log("❌ ERRORS:\n");
    const errorsByFile = {};

    allErrors.forEach((err) => {
      const fileKey = err.file || "General";
      if (!errorsByFile[fileKey]) {
        errorsByFile[fileKey] = [];
      }
      errorsByFile[fileKey].push(err);
    });

    Object.entries(errorsByFile).forEach(([file, errors]) => {
      console.log(`\n📄 ${file}:`);
      errors.forEach((err) => {
        if (err.exerciseNum) {
          console.log(
            `   Exercise ${err.exerciseNum} (${err.topic}): ${err.message}`
          );
          if (err.matches) {
            console.log(`      Found: ${err.matches.join(", ")}`);
          }
        } else {
          console.log(`   ${err.message}`);
        }
      });
    });

    console.log("\n");
  }

  // Exit with appropriate code
  if (allErrors.length > 0) {
    console.error(
      "❌ PostgreSQL content validation failed! Please fix the errors above.\n"
    );
    process.exit(1);
  } else {
    console.log("✅ All PostgreSQL content validated successfully!\n");
    process.exit(0);
  }
}

// Run validation
validatePostgreSQLContent().catch((error) => {
  console.error(`❌ Validation script error: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
