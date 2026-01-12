#!/usr/bin/env node

/**
 * Simple script to create new locale translation files across all languages
 *
 * Usage:
 *   node scripts/create-locale.mjs
 *   or
 *   npm run create:locale
 *
 * This script:
 * 1. Prompts for a namespace/filename (e.g., "user-profile", "dashboard")
 * 2. Creates an empty JSON file with that name in all language directories
 *
 * Features:
 * - Simple single-prompt interface
 * - Creates files for all existing language directories
 * - Non-destructive: Skips existing files
 * - Pretty-printed JSON output
 */
import { existsSync } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the project root directory
const projectRoot = join(__dirname, "..");
const localesDir = join(projectRoot, "src", "translations", "locales");

/**
 * Get all existing language directories
 */
async function getLanguageDirectories() {
  try {
    const entries = await readdir(localesDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    console.error(`Error reading locales directory:`, error.message);
    return [];
  }
}

/**
 * Validate namespace name format
 */
function isValidNamespace(name) {
  return /^[a-z][a-z0-9-]*$/.test(name);
}

/**
 * Create empty translation file
 */
async function createTranslationFile(language, namespace) {
  const langDir = join(localesDir, language);
  const filePath = join(langDir, `${namespace}.json`);

  // Skip if file already exists
  if (existsSync(filePath)) {
    return { created: false, path: filePath };
  }

  // Ensure directory exists
  if (!existsSync(langDir)) {
    await mkdir(langDir, { recursive: true });
  }

  // Create empty JSON object
  const content = JSON.stringify({}, null, 2) + "\n";
  await writeFile(filePath, content, "utf-8");

  return { created: true, path: filePath };
}

/**
 * Main function
 */
async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    console.log("🌍 Create New Locale Files\n");
    console.log("=".repeat(50));
    console.log(
      "This will create a new JSON file in all language directories.",
    );
    console.log("Format: lowercase letters, numbers, and hyphens");
    console.log("Examples: user-profile, dashboard, settings, auth\n");

    // Prompt for namespace
    const name = await rl.question("Enter filename (without .json): ");
    const namespace = name.trim().toLowerCase();

    // Validate namespace
    if (!namespace) {
      console.log("\n❌ Filename cannot be empty.");
      rl.close();
      return;
    }

    if (!isValidNamespace(namespace)) {
      console.log("\n❌ Invalid filename format.");
      console.log("Use lowercase letters, numbers, and hyphens only.");
      console.log(
        "Must start with a letter (e.g., 'user-profile', 'dashboard')",
      );
      rl.close();
      return;
    }

    // Get all language directories
    const languages = await getLanguageDirectories();

    if (languages.length === 0) {
      console.log(
        "\n❌ No language directories found in src/translations/locales",
      );
      rl.close();
      return;
    }

    console.log(
      `\n🔨 Creating ${namespace}.json in ${languages.length} language(s)...\n`,
    );

    // Create files for all languages
    const results = {
      created: [],
      skipped: [],
    };

    for (const lang of languages) {
      const result = await createTranslationFile(lang, namespace);

      if (result.created) {
        results.created.push(lang);
        console.log(`✅ Created: ${lang}/${namespace}.json`);
      } else {
        results.skipped.push(lang);
        console.log(`⏭️  Skipped: ${lang}/${namespace}.json (already exists)`);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("✨ Done!");
    console.log("=".repeat(50));

    if (results.created.length > 0) {
      console.log(
        `\n✅ Created ${results.created.length} new file(s): ${results.created.join(", ")}`,
      );
    }

    if (results.skipped.length > 0) {
      console.log(
        `\n⏭️  Skipped ${results.skipped.length} existing file(s): ${results.skipped.join(", ")}`,
      );
    }

    // Next steps
    console.log("\n💡 Next steps:");
    console.log("   1. Add translation keys to the JSON files");
    console.log(
      "   2. Run 'npm run generate:i18n-types' to update TypeScript types",
    );
    console.log("   3. Test the translations in your app\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
main();
