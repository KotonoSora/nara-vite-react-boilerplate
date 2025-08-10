import type { TranslationKey } from "./types";

export interface TranslationContext {
  formality?: "formal" | "informal";
  audience?: "general" | "technical" | "marketing" | "legal";
  purpose?: "navigation" | "content" | "error" | "confirmation";
  gender?: "neutral" | "masculine" | "feminine";
  number?: "singular" | "plural";
  tense?: "present" | "past" | "future";
}

export interface TranslationVariable {
  key: string;
  type: "string" | "number" | "date" | "currency" | "component";
  required: boolean;
  format?: string;
  validation?: RegExp;
  examples?: string[];
}

export interface TranslationMetadata {
  key: string;
  context?: TranslationContext;
  variables?: TranslationVariable[];
  maxLength?: number;
  tags?: string[];
  notes?: string;
  lastModified?: Date;
  translator?: string;
  reviewStatus?: "pending" | "approved" | "rejected";
}

export interface ContextAwareTranslation {
  default: string;
  contexts?: {
    [contextKey: string]: string;
  };
  metadata?: TranslationMetadata;
}

export class AdvancedTranslationManager {
  private translations: Map<string, Map<string, ContextAwareTranslation>> = new Map();
  private fallbackChain: string[] = ["en"];
  private currentLanguage: string = "en";
  private contextStack: TranslationContext[] = [];
  private cache: Map<string, string> = new Map();
  private analytics: Map<string, { count: number; lastUsed: Date; contexts: Set<string> }> = new Map();

  constructor(language: string = "en", fallbacks: string[] = ["en"]) {
    this.currentLanguage = language;
    this.fallbackChain = [language, ...fallbacks.filter(l => l !== language)];
  }

  /**
   * Load translations with context support
   */
  loadTranslations(language: string, translations: Record<string, ContextAwareTranslation | string>) {
    if (!this.translations.has(language)) {
      this.translations.set(language, new Map());
    }
    
    const langMap = this.translations.get(language)!;
    
    for (const [key, value] of Object.entries(translations)) {
      if (typeof value === "string") {
        langMap.set(key, { default: value });
      } else {
        langMap.set(key, value);
      }
    }
  }

  /**
   * Set translation context for subsequent translations
   */
  setContext(context: TranslationContext) {
    this.contextStack.push(context);
  }

  /**
   * Clear the current context
   */
  clearContext() {
    this.contextStack.pop();
  }

  /**
   * Get translation with context awareness
   */
  translate(
    key: TranslationKey,
    variables?: Record<string, any>,
    context?: TranslationContext
  ): string {
    const effectiveContext = { ...this.getMergedContext(), ...context };
    const cacheKey = this.generateCacheKey(key, variables, effectiveContext);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      this.trackUsage(key, effectiveContext);
      return this.cache.get(cacheKey)!;
    }

    let translation: string | null = null;

    // Try to find translation in language chain
    for (const lang of this.fallbackChain) {
      const langMap = this.translations.get(lang);
      if (!langMap) continue;

      const translationData = langMap.get(key);
      if (!translationData) continue;

      // Try context-specific translation first
      if (translationData.contexts && effectiveContext) {
        translation = this.findContextualTranslation(translationData.contexts, effectiveContext);
      }

      // Fall back to default
      if (!translation) {
        translation = translationData.default;
      }

      if (translation) break;
    }

    // Use key as fallback if no translation found
    if (!translation) {
      translation = key;
      console.warn(`Missing translation for key: ${key} in language: ${this.currentLanguage}`);
    }

    // Process variables
    if (variables && translation) {
      translation = this.interpolateVariables(translation, variables, effectiveContext);
    }

    // Cache the result
    this.cache.set(cacheKey, translation);
    this.trackUsage(key, effectiveContext);

    return translation;
  }

  /**
   * Find the best contextual translation match
   */
  private findContextualTranslation(
    contexts: Record<string, string>,
    context: TranslationContext
  ): string | null {
    // Exact match first
    const exactKey = this.generateContextKey(context);
    if (contexts[exactKey]) {
      return contexts[exactKey];
    }

    // Partial matches with scoring
    const matches: Array<{ key: string; translation: string; score: number }> = [];

    for (const [contextKey, translation] of Object.entries(contexts)) {
      const score = this.calculateContextScore(contextKey, context);
      if (score > 0) {
        matches.push({ key: contextKey, translation, score });
      }
    }

    // Return the best match
    if (matches.length > 0) {
      matches.sort((a, b) => b.score - a.score);
      return matches[0].translation;
    }

    return null;
  }

  /**
   * Calculate how well a context key matches the current context
   */
  private calculateContextScore(contextKey: string, context: TranslationContext): number {
    const contextParts = contextKey.split(".");
    let score = 0;

    for (const part of contextParts) {
      const [key, value] = part.split(":");
      if (key in context && (context as any)[key] === value) {
        score += 1;
      } else if (key in context) {
        score -= 0.5; // Penalty for wrong value
      }
    }

    return score;
  }

  /**
   * Generate context key from context object
   */
  private generateContextKey(context: TranslationContext): string {
    const parts: string[] = [];
    
    if (context.formality) parts.push(`formality:${context.formality}`);
    if (context.audience) parts.push(`audience:${context.audience}`);
    if (context.purpose) parts.push(`purpose:${context.purpose}`);
    if (context.gender) parts.push(`gender:${context.gender}`);
    if (context.number) parts.push(`number:${context.number}`);
    if (context.tense) parts.push(`tense:${context.tense}`);

    return parts.join(".");
  }

  /**
   * Interpolate variables into translation string
   */
  private interpolateVariables(
    translation: string,
    variables: Record<string, any>,
    context: TranslationContext
  ): string {
    let result = translation;

    // Basic variable substitution
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      if (result.includes(placeholder)) {
        const formattedValue = this.formatVariable(value, key, context);
        result = result.replace(new RegExp(placeholder, "g"), formattedValue);
      }
    }

    // Advanced formatting with pipes
    const formatRegex = /\{\{(\w+)\|([^}]+)\}\}/g;
    result = result.replace(formatRegex, (match, varKey, formatSpec) => {
      const value = variables[varKey];
      if (value !== undefined) {
        return this.formatWithSpec(value, formatSpec, context);
      }
      return match;
    });

    // Conditional expressions
    const conditionalRegex = /\{\{#if (\w+)\}\}(.*?)\{\{\/if\}\}/g;
    result = result.replace(conditionalRegex, (match, varKey, content) => {
      const value = variables[varKey];
      return value ? content : "";
    });

    // Pluralization
    const pluralRegex = /\{\{(\w+)\|(.*?)\}\}/g;
    result = result.replace(pluralRegex, (match, varKey, forms) => {
      const value = variables[varKey];
      if (typeof value === "number") {
        return this.pluralize(value, forms.split("|"), this.currentLanguage);
      }
      return match;
    });

    return result;
  }

  /**
   * Format variable based on type and context
   */
  private formatVariable(value: any, key: string, context: TranslationContext): string {
    if (value instanceof Date) {
      return new Intl.DateTimeFormat(this.currentLanguage).format(value);
    }

    if (typeof value === "number") {
      // Check if it should be formatted as currency
      if (key.toLowerCase().includes("price") || key.toLowerCase().includes("amount")) {
        return new Intl.NumberFormat(this.currentLanguage, {
          style: "currency",
          currency: "USD", // Could be contextual
        }).format(value);
      }
      return new Intl.NumberFormat(this.currentLanguage).format(value);
    }

    return String(value);
  }

  /**
   * Format value with specific format specification
   */
  private formatWithSpec(value: any, formatSpec: string, context: TranslationContext): string {
    const [type, ...options] = formatSpec.split(":");

    switch (type) {
      case "date":
        if (value instanceof Date) {
          const style = options[0] || "medium";
          return new Intl.DateTimeFormat(this.currentLanguage, {
            dateStyle: style as any,
          }).format(value);
        }
        break;

      case "time":
        if (value instanceof Date) {
          const style = options[0] || "short";
          return new Intl.DateTimeFormat(this.currentLanguage, {
            timeStyle: style as any,
          }).format(value);
        }
        break;

      case "currency":
        if (typeof value === "number") {
          const currency = options[0] || "USD";
          return new Intl.NumberFormat(this.currentLanguage, {
            style: "currency",
            currency,
          }).format(value);
        }
        break;

      case "percent":
        if (typeof value === "number") {
          return new Intl.NumberFormat(this.currentLanguage, {
            style: "percent",
          }).format(value / 100);
        }
        break;

      case "uppercase":
        return String(value).toUpperCase();

      case "lowercase":
        return String(value).toLowerCase();

      case "capitalize":
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
    }

    return String(value);
  }

  /**
   * Pluralize based on language-specific rules
   */
  private pluralize(count: number, forms: string[], language: string): string {
    // Simplified pluralization - in production, use a library like Intl.PluralRules
    const pluralRules = new Intl.PluralRules(language);
    const rule = pluralRules.select(count);

    const formMap: Record<string, number> = {
      zero: 0,
      one: 1,
      two: 2,
      few: 3,
      many: 4,
      other: forms.length - 1,
    };

    const formIndex = formMap[rule] || formMap.other;
    return forms[formIndex] || forms[forms.length - 1] || "";
  }

  /**
   * Get merged context from context stack
   */
  private getMergedContext(): TranslationContext {
    return this.contextStack.reduce((merged, context) => ({ ...merged, ...context }), {});
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(
    key: string,
    variables?: Record<string, any>,
    context?: TranslationContext
  ): string {
    const parts = [key];
    
    if (variables) {
      parts.push(JSON.stringify(variables));
    }
    
    if (context) {
      parts.push(this.generateContextKey(context));
    }

    return parts.join("|");
  }

  /**
   * Track translation usage for analytics
   */
  private trackUsage(key: string, context: TranslationContext) {
    const contextKey = this.generateContextKey(context);
    
    if (!this.analytics.has(key)) {
      this.analytics.set(key, {
        count: 0,
        lastUsed: new Date(),
        contexts: new Set(),
      });
    }

    const stats = this.analytics.get(key)!;
    stats.count++;
    stats.lastUsed = new Date();
    stats.contexts.add(contextKey);
  }

  /**
   * Get usage analytics
   */
  getAnalytics(): Array<{
    key: string;
    count: number;
    lastUsed: Date;
    contexts: string[];
  }> {
    return Array.from(this.analytics.entries()).map(([key, stats]) => ({
      key,
      count: stats.count,
      lastUsed: stats.lastUsed,
      contexts: Array.from(stats.contexts),
    }));
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Validate translations for completeness
   */
  validateTranslations(language: string): {
    missing: string[];
    incomplete: string[];
    warnings: Array<{ key: string; message: string }>;
  } {
    const baseLanguage = "en";
    const baseLangMap = this.translations.get(baseLanguage);
    const targetLangMap = this.translations.get(language);

    const missing: string[] = [];
    const incomplete: string[] = [];
    const warnings: Array<{ key: string; message: string }> = [];

    if (!baseLangMap || !targetLangMap) {
      return { missing: [], incomplete: [], warnings: [] };
    }

    for (const [key, baseTranslation] of baseLangMap.entries()) {
      const targetTranslation = targetLangMap.get(key);

      if (!targetTranslation) {
        missing.push(key);
        continue;
      }

      // Check if contexts are properly translated
      if (baseTranslation.contexts && targetTranslation.contexts) {
        const baseContexts = Object.keys(baseTranslation.contexts);
        const targetContexts = Object.keys(targetTranslation.contexts);

        for (const contextKey of baseContexts) {
          if (!targetContexts.includes(contextKey)) {
            incomplete.push(`${key}.${contextKey}`);
          }
        }
      } else if (baseTranslation.contexts && !targetTranslation.contexts) {
        warnings.push({
          key,
          message: "Base translation has contexts but target doesn't",
        });
      }

      // Check for placeholder consistency
      const basePlaceholders = (baseTranslation.default.match(/\{\{[^}]+\}\}/g) || []);
      const targetPlaceholders = (targetTranslation.default.match(/\{\{[^}]+\}\}/g) || []);

      if (basePlaceholders.length !== targetPlaceholders.length) {
        warnings.push({
          key,
          message: "Placeholder count mismatch",
        });
      }
    }

    return { missing, incomplete, warnings };
  }

  /**
   * Export translations for external tools
   */
  exportTranslations(language: string, format: "json" | "csv" | "xlsx" = "json") {
    const langMap = this.translations.get(language);
    if (!langMap) return null;

    switch (format) {
      case "json":
        return JSON.stringify(Object.fromEntries(langMap.entries()), null, 2);

      case "csv":
        const csvRows = ["Key,Default,Contexts"];
        for (const [key, translation] of langMap.entries()) {
          const contexts = translation.contexts 
            ? JSON.stringify(translation.contexts).replace(/"/g, '""')
            : "";
          csvRows.push(`"${key}","${translation.default}","${contexts}"`);
        }
        return csvRows.join("\n");

      default:
        return JSON.stringify(Object.fromEntries(langMap.entries()), null, 2);
    }
  }
}