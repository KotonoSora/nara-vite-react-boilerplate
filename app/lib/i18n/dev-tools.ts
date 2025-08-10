import type { SupportedLanguage, TranslationKey, NestedTranslationObject } from "./types";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "./config";
import { getTranslation } from "./translations";

// Translation validation result
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  coverage: number; // Percentage of translations available
}

export interface ValidationError {
  type: "missing" | "invalid_format" | "broken_interpolation" | "encoding";
  key: string;
  language: SupportedLanguage;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationWarning {
  type: "unused" | "long_text" | "inconsistent_casing" | "missing_context";
  key: string;
  language?: SupportedLanguage;
  message: string;
  suggestion?: string;
}

// Translation usage analytics
export interface TranslationUsage {
  key: string;
  usageCount: number;
  lastUsed: number;
  languages: SupportedLanguage[];
  contexts: string[]; // Where it's used (component names, routes, etc.)
}

// Missing translation detector
class MissingTranslationDetector {
  private missingKeys = new Map<string, Set<SupportedLanguage>>();
  private usedKeys = new Set<string>();

  recordMissingTranslation(key: string, language: SupportedLanguage): void {
    if (!this.missingKeys.has(key)) {
      this.missingKeys.set(key, new Set());
    }
    this.missingKeys.get(key)!.add(language);
  }

  recordUsedTranslation(key: string): void {
    this.usedKeys.add(key);
  }

  getMissingTranslations(): Array<{ key: string; languages: SupportedLanguage[] }> {
    return Array.from(this.missingKeys.entries()).map(([key, languages]) => ({
      key,
      languages: Array.from(languages),
    }));
  }

  getUsedKeys(): string[] {
    return Array.from(this.usedKeys);
  }

  clear(): void {
    this.missingKeys.clear();
    this.usedKeys.clear();
  }
}

const missingTranslationDetector = new MissingTranslationDetector();

// Translation validator
export class TranslationValidator {
  private translations: Record<SupportedLanguage, NestedTranslationObject>;

  constructor(translations: Record<SupportedLanguage, NestedTranslationObject>) {
    this.translations = translations;
  }

  validateAll(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let totalKeys = 0;
    let validKeys = 0;

    // Get all possible keys from default language
    const allKeys = this.extractAllKeys(this.translations[DEFAULT_LANGUAGE]);
    totalKeys = allKeys.length * SUPPORTED_LANGUAGES.length;

    for (const language of SUPPORTED_LANGUAGES) {
      const languageTranslations = this.translations[language] || {};
      
      for (const key of allKeys) {
        const result = this.validateKey(key, language, languageTranslations);
        
        if (result.valid) {
          validKeys++;
        } else {
          errors.push(...result.errors);
        }
        
        warnings.push(...result.warnings);
      }
    }

    // Check for unused translations
    const usedKeys = missingTranslationDetector.getUsedKeys();
    const unusedKeys = allKeys.filter(key => !usedKeys.includes(key));
    
    for (const key of unusedKeys) {
      warnings.push({
        type: "unused",
        key,
        message: `Translation key "${key}" appears to be unused`,
        suggestion: "Consider removing unused translations to reduce bundle size",
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      coverage: totalKeys > 0 ? (validKeys / totalKeys) * 100 : 100,
    };
  }

  validateKey(
    key: string,
    language: SupportedLanguage,
    translations: NestedTranslationObject
  ): { valid: boolean; errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check if translation exists
    const translation = this.getNestedValue(translations, key);
    
    if (translation === undefined) {
      errors.push({
        type: "missing",
        key,
        language,
        message: `Missing translation for key "${key}" in language "${language}"`,
        severity: "error",
      });
      return { valid: false, errors, warnings };
    }

    if (typeof translation !== "string") {
      errors.push({
        type: "invalid_format",
        key,
        language,
        message: `Translation for key "${key}" in language "${language}" is not a string`,
        severity: "error",
      });
      return { valid: false, errors, warnings };
    }

    // Validate interpolation syntax
    const interpolationMatches = translation.match(/\{\{(\w+)\}\}/g);
    if (interpolationMatches) {
      // Check for balanced braces
      const openBraces = (translation.match(/\{\{/g) || []).length;
      const closeBraces = (translation.match(/\}\}/g) || []).length;
      
      if (openBraces !== closeBraces) {
        errors.push({
          type: "broken_interpolation",
          key,
          language,
          message: `Unbalanced interpolation braces in "${key}" for language "${language}"`,
          severity: "error",
        });
        return { valid: false, errors, warnings };
      }
    }

    // Check for extremely long translations
    if (translation.length > 500) {
      warnings.push({
        type: "long_text",
        key,
        language,
        message: `Translation for "${key}" in "${language}" is very long (${translation.length} characters)`,
        suggestion: "Consider breaking down long translations into smaller parts",
      });
    }

    // Check for encoding issues
    if (!/^[\x00-\x7F]*$/.test(translation) && language === "en") {
      warnings.push({
        type: "encoding",
        key,
        language,
        message: `English translation for "${key}" contains non-ASCII characters`,
        suggestion: "Verify that special characters are intentional",
      });
    }

    return { valid: true, errors, warnings };
  }

  private extractAllKeys(obj: NestedTranslationObject, prefix = ""): string[] {
    const keys: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === "string") {
        keys.push(fullKey);
      } else if (typeof value === "object" && value !== null) {
        keys.push(...this.extractAllKeys(value, fullKey));
      }
    }
    
    return keys;
  }

  private getNestedValue(obj: NestedTranslationObject, path: string): unknown {
    return path.split(".").reduce<unknown>((current, key) => {
      return current &&
        typeof current === "object" &&
        current !== null &&
        key in current
        ? (current as Record<string, unknown>)[key]
        : undefined;
    }, obj);
  }
}

// Auto-translation suggestions (for development)
export class AutoTranslationSuggester {
  private commonPatterns: Record<string, Record<SupportedLanguage, string>> = {
    "common.loading": {
      en: "Loading...",
      es: "Cargando...",
      fr: "Chargement...",
      zh: "加载中...",
      hi: "लोड हो रहा है...",
      ar: "جاري التحميل...",
      vi: "Đang tải...",
      ja: "読み込み中...",
      th: "กำลังโหลด...",
    },
    "common.save": {
      en: "Save",
      es: "Guardar",
      fr: "Enregistrer",
      zh: "保存",
      hi: "सेव करें",
      ar: "حفظ",
      vi: "Lưu",
      ja: "保存",
      th: "บันทึก",
    },
    "common.cancel": {
      en: "Cancel",
      es: "Cancelar",
      fr: "Annuler",
      zh: "取消",
      hi: "रद्द करें",
      ar: "إلغاء",
      vi: "Hủy",
      ja: "キャンセル",
      th: "ยกเลิก",
    },
    // Add more common patterns...
  };

  suggestTranslation(
    key: string,
    sourceLanguage: SupportedLanguage,
    targetLanguage: SupportedLanguage,
    sourceText: string
  ): string | null {
    // Check common patterns first
    if (this.commonPatterns[key]) {
      return this.commonPatterns[key][targetLanguage] || null;
    }

    // Simple pattern matching
    return this.generateBasicSuggestion(sourceText, sourceLanguage, targetLanguage);
  }

  private generateBasicSuggestion(
    sourceText: string,
    sourceLanguage: SupportedLanguage,
    targetLanguage: SupportedLanguage
  ): string | null {
    // This is a very basic implementation
    // In a real application, you might integrate with translation APIs
    
    const simplePatterns: Record<string, Record<SupportedLanguage, string>> = {
      "yes": { en: "Yes", es: "Sí", fr: "Oui", zh: "是", hi: "हाँ", ar: "نعم", vi: "Có", ja: "はい", th: "ใช่" },
      "no": { en: "No", es: "No", fr: "Non", zh: "不", hi: "नहीं", ar: "لا", vi: "Không", ja: "いいえ", th: "ไม่" },
      "ok": { en: "OK", es: "Aceptar", fr: "OK", zh: "确定", hi: "ठीक है", ar: "موافق", vi: "OK", ja: "OK", th: "ตกลง" },
    };

    const lowerSource = sourceText.toLowerCase();
    if (simplePatterns[lowerSource]) {
      return simplePatterns[lowerSource][targetLanguage] || null;
    }

    return null;
  }
}

// Translation usage tracker
export class TranslationUsageTracker {
  private usage = new Map<string, TranslationUsage>();

  trackUsage(key: string, context?: string): void {
    const existing = this.usage.get(key);
    
    if (existing) {
      existing.usageCount++;
      existing.lastUsed = Date.now();
      if (context && !existing.contexts.includes(context)) {
        existing.contexts.push(context);
      }
    } else {
      this.usage.set(key, {
        key,
        usageCount: 1,
        lastUsed: Date.now(),
        languages: [],
        contexts: context ? [context] : [],
      });
    }

    // Record in missing translation detector
    missingTranslationDetector.recordUsedTranslation(key);
  }

  getUsageStats(): TranslationUsage[] {
    return Array.from(this.usage.values())
      .sort((a, b) => b.usageCount - a.usageCount);
  }

  getUnusedTranslations(allKeys: string[]): string[] {
    const usedKeys = new Set(this.usage.keys());
    return allKeys.filter(key => !usedKeys.has(key));
  }

  exportUsageReport(): string {
    const stats = this.getUsageStats();
    
    let report = "# Translation Usage Report\n\n";
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Total tracked keys: ${stats.length}\n\n`;
    
    report += "## Most Used Translations\n\n";
    stats.slice(0, 20).forEach((usage, index) => {
      report += `${index + 1}. **${usage.key}** (${usage.usageCount} uses)\n`;
      if (usage.contexts.length > 0) {
        report += `   - Contexts: ${usage.contexts.join(", ")}\n`;
      }
      report += `   - Last used: ${new Date(usage.lastUsed).toLocaleString()}\n\n`;
    });
    
    return report;
  }
}

// Development mode enhancements
export class DevelopmentHelper {
  private validator: TranslationValidator;
  private suggester: AutoTranslationSuggester;
  private tracker: TranslationUsageTracker;

  constructor(translations: Record<SupportedLanguage, NestedTranslationObject>) {
    this.validator = new TranslationValidator(translations);
    this.suggester = new AutoTranslationSuggester();
    this.tracker = new TranslationUsageTracker();
  }

  // Enhanced translation function with development features
  translate(
    key: TranslationKey,
    language: SupportedLanguage,
    params?: Record<string, string | number>,
    context?: string
  ): string {
    // Track usage in development
    this.tracker.trackUsage(key, context);

    // Get translation
    const translation = getTranslation(language, key, params);
    
    // In development, detect missing translations
    if (translation === key) {
      missingTranslationDetector.recordMissingTranslation(key, language);
      
      // Try to suggest a translation
      const englishTranslation = getTranslation("en", key, params);
      if (englishTranslation !== key && language !== "en") {
        const suggestion = this.suggester.suggestTranslation(key, "en", language, englishTranslation);
        if (suggestion) {
          console.warn(
            `Missing translation for "${key}" in "${language}". Suggestion: "${suggestion}"`
          );
        }
      }
    }

    return translation;
  }

  // Validate all translations
  validateTranslations(): ValidationResult {
    return this.validator.validateAll();
  }

  // Get missing translations report
  getMissingTranslationsReport(): string {
    const missing = missingTranslationDetector.getMissingTranslations();
    
    let report = "# Missing Translations Report\n\n";
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Total missing translations: ${missing.length}\n\n`;
    
    if (missing.length === 0) {
      report += "✅ No missing translations found!\n";
    } else {
      missing.forEach(({ key, languages }) => {
        report += `- **${key}**\n`;
        report += `  - Missing in: ${languages.join(", ")}\n\n`;
      });
    }
    
    return report;
  }

  // Get validation report
  getValidationReport(): string {
    const result = this.validateTranslations();
    
    let report = "# Translation Validation Report\n\n";
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Coverage: ${result.coverage.toFixed(1)}%\n`;
    report += `Status: ${result.valid ? "✅ Valid" : "❌ Issues Found"}\n\n`;
    
    if (result.errors.length > 0) {
      report += "## Errors\n\n";
      result.errors.forEach(error => {
        report += `- **${error.key}** (${error.language}): ${error.message}\n`;
      });
      report += "\n";
    }
    
    if (result.warnings.length > 0) {
      report += "## Warnings\n\n";
      result.warnings.forEach(warning => {
        report += `- **${warning.key}**: ${warning.message}\n`;
        if (warning.suggestion) {
          report += `  - Suggestion: ${warning.suggestion}\n`;
        }
      });
    }
    
    return report;
  }

  // Export comprehensive development report
  exportDevelopmentReport(): {
    validation: string;
    missing: string;
    usage: string;
  } {
    return {
      validation: this.getValidationReport(),
      missing: this.getMissingTranslationsReport(),
      usage: this.tracker.exportUsageReport(),
    };
  }
}

// Global development helper instance
let developmentHelper: DevelopmentHelper | null = null;

export function initializeDevelopmentTools(
  translations: Record<SupportedLanguage, NestedTranslationObject>
): DevelopmentHelper {
  developmentHelper = new DevelopmentHelper(translations);
  return developmentHelper;
}

export function getDevelopmentHelper(): DevelopmentHelper | null {
  return developmentHelper;
}

// Console commands for development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).naraI18nDev = {
    validate: () => {
      const helper = getDevelopmentHelper();
      if (helper) {
        console.log(helper.getValidationReport());
      } else {
        console.log("Development tools not initialized");
      }
    },
    missing: () => {
      const helper = getDevelopmentHelper();
      if (helper) {
        console.log(helper.getMissingTranslationsReport());
      } else {
        console.log("Development tools not initialized");
      }
    },
    usage: () => {
      const helper = getDevelopmentHelper();
      if (helper) {
        console.log(helper.tracker.exportUsageReport());
      } else {
        console.log("Development tools not initialized");
      }
    },
    export: () => {
      const helper = getDevelopmentHelper();
      if (helper) {
        const reports = helper.exportDevelopmentReport();
        console.log("Validation Report:", reports.validation);
        console.log("Missing Translations Report:", reports.missing);
        console.log("Usage Report:", reports.usage);
      } else {
        console.log("Development tools not initialized");
      }
    },
  };
  
  console.log(
    "🌍 NARA i18n Development Tools Available:\n" +
    "  - naraI18nDev.validate() - Validate all translations\n" +
    "  - naraI18nDev.missing() - Show missing translations\n" +
    "  - naraI18nDev.usage() - Show usage statistics\n" +
    "  - naraI18nDev.export() - Export all reports"
  );
}

export {
  missingTranslationDetector,
  TranslationValidator,
  AutoTranslationSuggester,
  TranslationUsageTracker,
};