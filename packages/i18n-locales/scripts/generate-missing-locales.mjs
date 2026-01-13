#!/usr/bin/env node

/**
 * Script to auto-generate missing JSON locale files for all languages
 * based on the English locale files in src/locales/en/
 *
 * Usage:
 *   node scripts/generate-missing-locales.mjs
 *   or
 *   bun scripts/generate-missing-locales.mjs
 *
 * This script will:
 * 1. Read all JSON files from src/locales/en/
 * 2. For each other language directory, check which files are missing
 * 3. Generate missing files with English content as placeholders
 * 4. Add a comment header indicating the file needs translation
 */
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the project root directory
const projectRoot = join(__dirname, "..");
const localesDir = join(projectRoot, "src", "locales");
const baseLanguage = "en";

/**
 * Convert kebab-case to camelCase
 */
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Get all JSON files in a directory
 */
async function getJsonFiles(dir) {
  try {
    const files = await readdir(dir);
    return files.filter((file) => file.endsWith(".json"));
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
    return [];
  }
}

/**
 * Get all language directories
 */
async function getLanguageDirectories() {
  try {
    const entries = await readdir(localesDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && entry.name !== baseLanguage)
      .map((entry) => entry.name);
  } catch (error) {
    console.error(`Error reading locales directory:`, error.message);
    return [];
  }
}

/**
 * Read and parse index.ts file
 */
async function readIndexFile(language) {
  const indexPath = join(localesDir, language, "index.ts");
  if (!existsSync(indexPath)) {
    return null;
  }

  const content = await readFile(indexPath, "utf-8");
  return content;
}

/**
 * Update index.ts file with new namespace
 */
async function updateIndexFile(language, namespace) {
  const indexPath = join(localesDir, language, "index.ts");
  const content = await readIndexFile(language);

  if (!content) {
    console.log(`⚠️  Warning: index.ts not found for ${language}`);
    return false;
  }

  // Convert namespace to camelCase for the property name
  const camelCaseName = toCamelCase(namespace);

  // For variable names: prefix + PascalCase of the namespace
  // e.g., viCommon, enAbout, frQrGenerator
  const pascalCaseName =
    camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1);
  const varName = `${language}${pascalCaseName}`;

  // Check if namespace already exists
  if (content.includes(`from "./${namespace}.json"`)) {
    return false; // Already exists
  }

  // Find the last import statement
  const importLines = content.split("\n");
  let lastImportIndex = -1;

  for (let i = 0; i < importLines.length; i++) {
    const line = importLines[i].trim();
    if (
      line.startsWith("import ") &&
      line.includes('from "./') &&
      line.endsWith('.json";')
    ) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex === -1) {
    console.log(
      `⚠️  Warning: Could not find import section in ${language}/index.ts`,
    );
    return false;
  }

  // Add new import after the last import
  const newImport = `import ${varName} from "./${namespace}.json";`;
  importLines.splice(lastImportIndex + 1, 0, newImport);

  // Find the export object and add new namespace
  const exportStartIndex = importLines.findIndex(
    (line) =>
      line.includes("Translations = {") || line.includes("export const"),
  );

  if (exportStartIndex === -1) {
    console.log(
      `⚠️  Warning: Could not find export section in ${language}/index.ts`,
    );
    return false;
  }

  // Find the closing brace of the export object
  let braceCount = 0;
  let exportEndIndex = -1;
  let insideExportObject = false;

  for (let i = exportStartIndex; i < importLines.length; i++) {
    const line = importLines[i];

    if (!insideExportObject && line.includes("= {")) {
      insideExportObject = true;
    }

    if (insideExportObject) {
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;

      if (braceCount === 0 && line.includes("}") && line.trim() === "};") {
        exportEndIndex = i;
        break;
      }
    }
  }

  if (exportEndIndex === -1) {
    console.log(
      `⚠️  Warning: Could not find end of export object in ${language}/index.ts`,
    );
    return false;
  }

  // Insert new property before the closing brace
  // Use quotes for kebab-case, plain identifier for camelCase
  const propertyName = namespace.includes("-")
    ? `"${namespace}"`
    : camelCaseName;
  const newProperty = `  ${propertyName}: ${varName},`;
  importLines.splice(exportEndIndex, 0, newProperty);

  // Write updated content
  const updatedContent = importLines.join("\n");
  await writeFile(indexPath, updatedContent, "utf-8");

  return true;
}

/**
 * Add translation comment to JSON content
 */
function addTranslationComment(content, language, filename) {
  const parsed = JSON.parse(content);

  // Create a commented version by adding a special key
  const commented = {
    _comment: `⚠️ This file needs translation to ${language.toUpperCase()}. Currently using English (EN) as placeholder.`,
    _filename: filename,
    _language: language,
    ...parsed,
  };

  return JSON.stringify(commented, null, 2) + "\n";
}

/**
 * Generate missing locale files for a specific language
 */
async function generateMissingLocalesForLanguage(language) {
  const baseDir = join(localesDir, baseLanguage);
  const targetDir = join(localesDir, language);

  // Ensure target directory exists
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
    console.log(`✅ Created directory: ${targetDir}`);
  }

  // Get all base language files
  const baseFiles = await getJsonFiles(baseDir);

  if (baseFiles.length === 0) {
    console.warn(`⚠️  No JSON files found in ${baseDir}`);
    return { created: 0, skipped: 0 };
  }

  let created = 0;
  let skipped = 0;
  let indexUpdated = 0;
  let indexFailed = 0;

  // Check each file
  for (const filename of baseFiles) {
    const targetFilePath = join(targetDir, filename);

    // Check if file already exists
    if (existsSync(targetFilePath)) {
      skipped++;
      continue;
    }

    // Read base file content
    const baseFilePath = join(baseDir, filename);
    const baseContent = await readFile(baseFilePath, "utf-8");

    // Add translation comment and write to target
    const commentedContent = addTranslationComment(
      baseContent,
      language,
      filename,
    );
    await writeFile(targetFilePath, commentedContent, "utf-8");

    console.log(`✅ Created: ${language}/${filename}`);
    created++;

    // Update index.ts file
    const namespace = filename.replace(".json", "");
    const indexUpdateResult = await updateIndexFile(language, namespace);
    if (indexUpdateResult) {
      indexUpdated++;
      console.log(`   ✅ Updated: ${language}/index.ts`);
    } else {
      indexFailed++;
      console.log(`   ⚠️  Warning: Could not update ${language}/index.ts`);
    }
  }

  return { created, skipped, indexUpdated, indexFailed };
}

/**
 * Main function
 */
async function main() {
  console.log("🌍 Auto-generating missing locale files...\n");
  console.log(`📂 Base language: ${baseLanguage}`);
  console.log(`📂 Locales directory: ${localesDir}\n`);

  // Get all language directories
  const languages = await getLanguageDirectories();

  if (languages.length === 0) {
    console.warn(
      "⚠️  No language directories found (excluding base language).",
    );
    return;
  }

  console.log(
    `📝 Found ${languages.length} language(s): ${languages.join(", ")}\n`,
  );

  let totalCreated = 0;
  let totalSkipped = 0;
  let totalIndexUpdated = 0;
  let totalIndexFailed = 0;

  // Process each language
  for (const language of languages) {
    console.log(`\n🔍 Processing language: ${language.toUpperCase()}`);
    console.log("─".repeat(50));

    const { created, skipped, indexUpdated, indexFailed } =
      await generateMissingLocalesForLanguage(language);
    totalCreated += created;
    totalSkipped += skipped;
    totalIndexUpdated += indexUpdated;
    totalIndexFailed += indexFailed;

    if (created > 0) {
      console.log(`✅ Created ${created} file(s) for ${language}`);
    }
    if (indexUpdated > 0) {
      console.log(
        `✅ Updated ${indexUpdated} index.ts entry/entries for ${language}`,
      );
    }
    if (indexFailed > 0) {
      console.log(
        `⚠️  Failed to update ${indexFailed} index.ts entry/entries for ${language}`,
      );
    }
    if (skipped > 0) {
      console.log(`⏭️  Skipped ${skipped} existing file(s) for ${language}`);
    }
    if (created === 0 && skipped === 0) {
      console.log(`✅ No missing files for ${language}`);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 Summary:");
  console.log("=".repeat(50));
  console.log(`✅ Total files created: ${totalCreated}`);
  console.log(`✅ Total index.ts files updated: ${totalIndexUpdated}`);
  if (totalIndexFailed > 0) {
    console.log(`⚠️  Total index.ts updates failed: ${totalIndexFailed}`);
  }
  console.log(`⏭️  Total files skipped: ${totalSkipped}`);

  if (totalCreated > 0) {
    console.log(
      "\n⚠️  Note: Generated files contain English text with translation markers.",
    );
    console.log("   Please translate the content to the appropriate language.");
  } else {
    console.log("\n✅ All locale files are up to date!");
  }

  console.log("\n✨ Done!\n");
}

// Run the script
main().catch((error) => {
  console.error("\n❌ Error:", error.message);
  console.error(error.stack);
  process.exit(1);
});
