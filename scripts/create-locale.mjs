#!/usr/bin/env node

/**
 * Interactive CLI script to create new locale translation files
 * 
 * Usage:
 *   node scripts/create-locale.mjs
 *   or
 *   npm run create:locale
 * 
 * This script provides an interactive CLI to:
 * 1. Select or create a language
 * 2. Select or create a translation namespace (e.g., "theme", "auth", "common")
 * 3. Input translation keys and values
 * 4. Generate the JSON file in the appropriate language directory
 * 
 * Features:
 * - Interactive prompts for user input
 * - Validates language codes and file names
 * - Supports adding translations to existing files or creating new ones
 * - Auto-generates files for all languages (with English placeholders)
 * - Pretty-printed JSON output
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the project root directory
const projectRoot = join(__dirname, "..");
const localesDir = join(projectRoot, "app", "locales");

// Supported language codes with names
const SUPPORTED_LANGUAGES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  ko: "Korean",
  pt: "Portuguese",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
  th: "Thai",
  vi: "Vietnamese",
};

/**
 * Create readline interface for user input
 */
function createReadlineInterface() {
  return readline.createInterface({ input, output });
}

/**
 * Get all existing language directories
 */
async function getExistingLanguages() {
  try {
    const entries = await readdir(localesDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((name) => SUPPORTED_LANGUAGES[name]);
  } catch (error) {
    console.error(`Error reading locales directory:`, error.message);
    return [];
  }
}

/**
 * Get all existing namespaces (JSON files) in a language directory
 */
async function getExistingNamespaces(language) {
  const langDir = join(localesDir, language);
  
  if (!existsSync(langDir)) {
    return [];
  }
  
  try {
    const files = await readdir(langDir);
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(".json", ""));
  } catch (error) {
    console.error(`Error reading language directory ${langDir}:`, error.message);
    return [];
  }
}

/**
 * Validate language code format
 */
function isValidLanguageCode(code) {
  return /^[a-z]{2,3}$/.test(code);
}

/**
 * Validate namespace name format
 */
function isValidNamespace(name) {
  return /^[a-z][a-z0-9-]*$/.test(name);
}

/**
 * Read existing translation file
 */
async function readTranslationFile(language, namespace) {
  const filePath = join(localesDir, language, `${namespace}.json`);
  
  if (!existsSync(filePath)) {
    return {};
  }
  
  try {
    const content = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(content);
    
    // Remove metadata keys
    const { _comment, _filename, _language, ...translations } = parsed;
    return translations;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return {};
  }
}

/**
 * Write translation file
 */
async function writeTranslationFile(language, namespace, translations, isNew = false) {
  const langDir = join(localesDir, language);
  const filePath = join(langDir, `${namespace}.json`);
  
  // Ensure directory exists
  if (!existsSync(langDir)) {
    await mkdir(langDir, { recursive: true });
  }
  
  // Sort keys alphabetically
  const sortedTranslations = Object.keys(translations)
    .sort()
    .reduce((acc, key) => {
      acc[key] = translations[key];
      return acc;
    }, {});
  
  const content = JSON.stringify(sortedTranslations, null, 2) + "\n";
  await writeFile(filePath, content, "utf-8");
  
  return filePath;
}

/**
 * Generate placeholder files for other languages
 */
async function generatePlaceholderFiles(sourceLanguage, namespace, translations) {
  const allLanguages = Object.keys(SUPPORTED_LANGUAGES);
  const created = [];
  
  for (const lang of allLanguages) {
    if (lang === sourceLanguage) continue;
    
    const langDir = join(localesDir, lang);
    const filePath = join(langDir, `${namespace}.json`);
    
    // Skip if file already exists
    if (existsSync(filePath)) continue;
    
    // Ensure directory exists
    if (!existsSync(langDir)) {
      await mkdir(langDir, { recursive: true });
    }
    
    // Create placeholder with metadata
    const placeholder = {
      _comment: `⚠️ This file needs translation to ${lang.toUpperCase()}. Currently using ${sourceLanguage.toUpperCase()} as placeholder.`,
      _filename: `${namespace}.json`,
      _language: lang,
      ...translations,
    };
    
    const content = JSON.stringify(placeholder, null, 2) + "\n";
    await writeFile(filePath, content, "utf-8");
    created.push(lang);
  }
  
  return created;
}

/**
 * Display menu and get user choice
 */
async function displayMenu(rl, title, options, allowCustom = false) {
  console.log(`\n${title}`);
  console.log("─".repeat(50));
  
  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });
  
  if (allowCustom) {
    console.log(`${options.length + 1}. Create new...`);
  }
  
  const answer = await rl.question("\nSelect an option (number): ");
  const choice = parseInt(answer.trim());
  
  if (isNaN(choice) || choice < 1 || choice > options.length + (allowCustom ? 1 : 0)) {
    console.log("❌ Invalid selection. Please try again.");
    return await displayMenu(rl, title, options, allowCustom);
  }
  
  if (allowCustom && choice === options.length + 1) {
    return "NEW";
  }
  
  return options[choice - 1];
}

/**
 * Prompt for new language code
 */
async function promptNewLanguage(rl) {
  console.log("\n📝 Creating new language...");
  console.log("Language code format: 2-3 lowercase letters (e.g., 'en', 'fr', 'de')");
  console.log("\nSupported languages:");
  Object.entries(SUPPORTED_LANGUAGES).forEach(([code, name]) => {
    console.log(`  ${code} - ${name}`);
  });
  
  const code = await rl.question("\nEnter language code: ");
  const trimmed = code.trim().toLowerCase();
  
  if (!isValidLanguageCode(trimmed)) {
    console.log("❌ Invalid language code format. Please try again.");
    return await promptNewLanguage(rl);
  }
  
  if (!SUPPORTED_LANGUAGES[trimmed]) {
    console.log(`⚠️  Warning: '${trimmed}' is not in the list of commonly supported languages.`);
    const confirm = await rl.question("Continue anyway? (y/n): ");
    if (confirm.toLowerCase() !== "y") {
      return await promptNewLanguage(rl);
    }
  }
  
  return trimmed;
}

/**
 * Prompt for new namespace
 */
async function promptNewNamespace(rl) {
  console.log("\n📝 Creating new namespace...");
  console.log("Namespace format: lowercase letters, numbers, and hyphens (e.g., 'auth', 'user-profile')");
  console.log("Examples: common, theme, auth, dashboard, user-settings");
  
  const name = await rl.question("\nEnter namespace name: ");
  const trimmed = name.trim().toLowerCase();
  
  if (!isValidNamespace(trimmed)) {
    console.log("❌ Invalid namespace format. Please try again.");
    return await promptNewNamespace(rl);
  }
  
  return trimmed;
}

/**
 * Prompt for translation keys and values
 */
async function promptTranslations(rl, existingTranslations = {}) {
  const translations = { ...existingTranslations };
  console.log("\n📝 Add translation keys and values");
  console.log("─".repeat(50));
  console.log("Format: Enter key-value pairs");
  console.log("Press Enter with empty key to finish\n");
  
  if (Object.keys(existingTranslations).length > 0) {
    console.log("Existing translations:");
    Object.entries(existingTranslations).forEach(([key, value]) => {
      console.log(`  ${key}: "${value}"`);
    });
    console.log("");
  }
  
  while (true) {
    const key = await rl.question("Translation key (or press Enter to finish): ");
    const trimmedKey = key.trim();
    
    if (!trimmedKey) {
      break;
    }
    
    // Validate key format (camelCase or dot notation)
    if (!/^[a-zA-Z][a-zA-Z0-9.]*$/.test(trimmedKey)) {
      console.log("❌ Invalid key format. Use camelCase or dot notation (e.g., 'myKey' or 'my.nested.key')");
      continue;
    }
    
    const value = await rl.question(`Translation value for "${trimmedKey}": `);
    const trimmedValue = value.trim();
    
    if (!trimmedValue) {
      console.log("❌ Value cannot be empty");
      continue;
    }
    
    translations[trimmedKey] = trimmedValue;
    console.log(`✅ Added: ${trimmedKey} = "${trimmedValue}"\n`);
  }
  
  if (Object.keys(translations).length === 0) {
    console.log("⚠️  No translations added.");
    const retry = await rl.question("Would you like to add translations? (y/n): ");
    if (retry.toLowerCase() === "y") {
      return await promptTranslations(rl, existingTranslations);
    }
  }
  
  return translations;
}

/**
 * Display summary and confirm
 */
async function confirmCreation(rl, language, namespace, translations) {
  console.log("\n" + "=".repeat(50));
  console.log("📋 Summary");
  console.log("=".repeat(50));
  console.log(`Language: ${language} (${SUPPORTED_LANGUAGES[language] || "Custom"})`);
  console.log(`Namespace: ${namespace}`);
  console.log(`Translation count: ${Object.keys(translations).length}`);
  console.log("\nTranslations:");
  Object.entries(translations).forEach(([key, value]) => {
    console.log(`  ${key}: "${value}"`);
  });
  
  const confirm = await rl.question("\nCreate these translations? (y/n): ");
  return confirm.toLowerCase() === "y";
}

/**
 * Main interactive flow
 */
async function main() {
  const rl = createReadlineInterface();
  
  try {
    console.log("🌍 Create New Locale Translation\n");
    console.log("=".repeat(50));
    
    // Step 1: Select or create language
    const existingLanguages = await getExistingLanguages();
    
    const languageOptions = existingLanguages.map((lang) => {
      const name = SUPPORTED_LANGUAGES[lang] || lang;
      return `${lang} - ${name}`;
    });
    
    const selectedLanguageOption = await displayMenu(
      rl,
      "Select language:",
      languageOptions,
      true
    );
    
    let language;
    if (selectedLanguageOption === "NEW") {
      language = await promptNewLanguage(rl);
    } else {
      language = selectedLanguageOption.split(" - ")[0];
    }
    
    console.log(`\n✅ Selected language: ${language} (${SUPPORTED_LANGUAGES[language] || "Custom"})`);
    
    // Step 2: Select or create namespace
    const existingNamespaces = await getExistingNamespaces(language);
    
    let namespace;
    if (existingNamespaces.length === 0) {
      console.log("\n📝 No existing namespaces found. Creating new namespace...");
      namespace = await promptNewNamespace(rl);
    } else {
      const namespaceOptions = existingNamespaces.map((ns) => `${ns}.json`);
      const selectedNamespace = await displayMenu(
        rl,
        "Select namespace:",
        namespaceOptions,
        true
      );
      
      if (selectedNamespace === "NEW") {
        namespace = await promptNewNamespace(rl);
      } else {
        namespace = selectedNamespace.replace(".json", "");
      }
    }
    
    console.log(`\n✅ Selected namespace: ${namespace}`);
    
    // Step 3: Load existing translations (if any)
    const existingTranslations = await readTranslationFile(language, namespace);
    const isNewFile = Object.keys(existingTranslations).length === 0;
    
    if (!isNewFile) {
      console.log(`\n📖 Found existing translations in ${language}/${namespace}.json`);
    }
    
    // Step 4: Add translations
    const translations = await promptTranslations(rl, existingTranslations);
    
    if (Object.keys(translations).length === 0) {
      console.log("\n❌ No translations to save. Exiting.");
      rl.close();
      return;
    }
    
    // Step 5: Confirm and create
    const confirmed = await confirmCreation(rl, language, namespace, translations);
    
    if (!confirmed) {
      console.log("\n❌ Creation cancelled.");
      rl.close();
      return;
    }
    
    console.log("\n🔨 Creating translation files...\n");
    
    // Save main file
    const filePath = await writeTranslationFile(language, namespace, translations, isNewFile);
    console.log(`✅ Created: ${filePath}`);
    
    // Generate placeholder files for other languages
    if (isNewFile) {
      const generatePlaceholders = await rl.question(
        "\nGenerate placeholder files for other languages? (y/n): "
      );
      
      if (generatePlaceholders.toLowerCase() === "y") {
        console.log("\n🔨 Generating placeholder files...\n");
        const created = await generatePlaceholderFiles(language, namespace, translations);
        
        if (created.length > 0) {
          console.log(`✅ Generated placeholders for: ${created.join(", ")}`);
          console.log("\n⚠️  Note: Placeholder files contain the source language text.");
          console.log("   Please translate them to the appropriate languages.");
        }
      }
    }
    
    console.log("\n" + "=".repeat(50));
    console.log("✨ Done! Translation file(s) created successfully.");
    console.log("=".repeat(50));
    
    // Suggest next steps
    console.log("\n💡 Next steps:");
    console.log("   1. Review the generated file(s)");
    console.log("   2. Run 'npm run generate:i18n-types' to update TypeScript types");
    console.log("   3. Translate placeholder files if generated");
    console.log("   4. Test the translations in your app\n");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
main();
