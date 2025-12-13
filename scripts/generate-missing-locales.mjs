#!/usr/bin/env node

/**
 * Script to auto-generate missing JSON locale files for all languages
 * based on the English locale files in app/locales/en/
 * 
 * Usage:
 *   node scripts/generate-missing-locales.mjs
 *   or
 *   bun scripts/generate-missing-locales.mjs
 * 
 * This script will:
 * 1. Read all JSON files from app/locales/en/
 * 2. For each other language directory, check which files are missing
 * 3. Generate missing files with English content as placeholders
 * 4. Add a comment header indicating the file needs translation
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the project root directory
const projectRoot = join(__dirname, "..");
const localesDir = join(projectRoot, "app", "locales");
const baseLanguage = "en";

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
    const commentedContent = addTranslationComment(baseContent, language, filename);
    await writeFile(targetFilePath, commentedContent, "utf-8");
    
    console.log(`✅ Created: ${language}/${filename}`);
    created++;
  }
  
  return { created, skipped };
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
    console.warn("⚠️  No language directories found (excluding base language).");
    return;
  }
  
  console.log(`📝 Found ${languages.length} language(s): ${languages.join(", ")}\n`);
  
  let totalCreated = 0;
  let totalSkipped = 0;
  
  // Process each language
  for (const language of languages) {
    console.log(`\n🔍 Processing language: ${language.toUpperCase()}`);
    console.log("─".repeat(50));
    
    const { created, skipped } = await generateMissingLocalesForLanguage(language);
    totalCreated += created;
    totalSkipped += skipped;
    
    if (created > 0) {
      console.log(`✅ Created ${created} file(s) for ${language}`);
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
  console.log(`⏭️  Total files skipped: ${totalSkipped}`);
  
  if (totalCreated > 0) {
    console.log("\n⚠️  Note: Generated files contain English text with translation markers.");
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
