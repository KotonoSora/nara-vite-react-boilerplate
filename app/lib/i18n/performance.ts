import type { SupportedLanguage } from "./config";
import type { NestedTranslationObject } from "./types";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./config";

// Translation chunk metadata
export interface TranslationChunk {
  language: SupportedLanguage;
  namespace: string;
  lastModified: number;
  size: number;
  hash: string;
}

// Cache configuration
export interface CacheConfig {
  maxSize: number; // Maximum cache size in bytes
  maxAge: number; // Maximum age in milliseconds
  preloadThreshold: number; // Confidence threshold for preloading
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  preloadThreshold: 0.7, // 70% confidence
};

// In-memory translation cache
class TranslationCache {
  private cache = new Map<string, { data: NestedTranslationObject; timestamp: number; size: number }>();
  private totalSize = 0;
  private config: CacheConfig;

  constructor(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
    this.config = config;
  }

  private generateKey(language: SupportedLanguage, namespace?: string): string {
    return namespace ? `${language}:${namespace}` : language;
  }

  set(
    language: SupportedLanguage,
    data: NestedTranslationObject,
    namespace?: string
  ): void {
    const key = this.generateKey(language, namespace);
    const size = this.estimateSize(data);
    const timestamp = Date.now();

    // Remove old entry if exists
    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key)!;
      this.totalSize -= oldEntry.size;
    }

    // Check if we need to make space
    this.ensureSpace(size);

    this.cache.set(key, { data, timestamp, size });
    this.totalSize += size;
  }

  get(language: SupportedLanguage, namespace?: string): NestedTranslationObject | null {
    const key = this.generateKey(language, namespace);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if entry is still valid
    if (Date.now() - entry.timestamp > this.config.maxAge) {
      this.delete(language, namespace);
      return null;
    }

    return entry.data;
  }

  delete(language: SupportedLanguage, namespace?: string): boolean {
    const key = this.generateKey(language, namespace);
    const entry = this.cache.get(key);

    if (entry) {
      this.totalSize -= entry.size;
      return this.cache.delete(key);
    }

    return false;
  }

  clear(): void {
    this.cache.clear();
    this.totalSize = 0;
  }

  private ensureSpace(requiredSize: number): void {
    while (this.totalSize + requiredSize > this.config.maxSize && this.cache.size > 0) {
      // Remove oldest entry
      let oldestKey: string | null = null;
      let oldestTime = Date.now();

      for (const [key, entry] of this.cache.entries()) {
        if (entry.timestamp < oldestTime) {
          oldestTime = entry.timestamp;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        const entry = this.cache.get(oldestKey)!;
        this.totalSize -= entry.size;
        this.cache.delete(oldestKey);
      } else {
        break;
      }
    }
  }

  private estimateSize(data: NestedTranslationObject): number {
    return JSON.stringify(data).length * 2; // Rough estimate (2 bytes per character)
  }

  getStats(): { size: number; count: number; maxSize: number } {
    return {
      size: this.totalSize,
      count: this.cache.size,
      maxSize: this.config.maxSize,
    };
  }
}

// Global cache instance
const translationCache = new TranslationCache();

// Browser storage for persistent caching
class PersistentCache {
  private dbName = "nara-translations";
  private version = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    if (typeof window === "undefined" || !window.indexedDB) {
      return; // No IndexedDB support
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains("translations")) {
          const store = db.createObjectStore("translations", { keyPath: "key" });
          store.createIndex("language", "language", { unique: false });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  async set(
    language: SupportedLanguage,
    data: NestedTranslationObject,
    namespace?: string
  ): Promise<void> {
    if (!this.db) return;

    const key = namespace ? `${language}:${namespace}` : language;
    const entry = {
      key,
      language,
      namespace,
      data,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["translations"], "readwrite");
      const store = transaction.objectStore("translations");
      const request = store.put(entry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get(language: SupportedLanguage, namespace?: string): Promise<NestedTranslationObject | null> {
    if (!this.db) return null;

    const key = namespace ? `${language}:${namespace}` : language;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["translations"], "readonly");
      const store = transaction.objectStore("translations");
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result && Date.now() - result.timestamp < DEFAULT_CACHE_CONFIG.maxAge) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
    });
  }

  async delete(language: SupportedLanguage, namespace?: string): Promise<void> {
    if (!this.db) return;

    const key = namespace ? `${language}:${namespace}` : language;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["translations"], "readwrite");
      const store = transaction.objectStore("translations");
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["translations"], "readwrite");
      const store = transaction.objectStore("translations");
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

const persistentCache = new PersistentCache();

// Language usage analytics
class LanguageAnalytics {
  private usage = new Map<SupportedLanguage, { count: number; lastUsed: number; avgDuration: number }>();

  recordUsage(language: SupportedLanguage, duration?: number): void {
    const current = this.usage.get(language) || { count: 0, lastUsed: 0, avgDuration: 0 };
    
    current.count++;
    current.lastUsed = Date.now();
    
    if (duration) {
      current.avgDuration = (current.avgDuration * (current.count - 1) + duration) / current.count;
    }
    
    this.usage.set(language, current);
    this.saveToStorage();
  }

  getUsageStats(): Map<SupportedLanguage, { count: number; lastUsed: number; avgDuration: number }> {
    return new Map(this.usage);
  }

  predictNextLanguages(currentLanguage: SupportedLanguage, limit = 3): SupportedLanguage[] {
    const stats = Array.from(this.usage.entries())
      .filter(([lang]) => lang !== currentLanguage)
      .map(([lang, data]) => ({
        language: lang,
        score: this.calculatePredictionScore(data),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.language);

    return stats;
  }

  private calculatePredictionScore(data: { count: number; lastUsed: number; avgDuration: number }): number {
    const recencyWeight = 0.4;
    const frequencyWeight = 0.4;
    const durationWeight = 0.2;
    
    const now = Date.now();
    const daysSinceLastUse = (now - data.lastUsed) / (1000 * 60 * 60 * 24);
    
    const recencyScore = Math.max(0, 1 - daysSinceLastUse / 30); // Decay over 30 days
    const frequencyScore = Math.min(1, data.count / 10); // Normalize to 10 uses
    const durationScore = Math.min(1, data.avgDuration / (5 * 60 * 1000)); // Normalize to 5 minutes
    
    return (
      recencyScore * recencyWeight +
      frequencyScore * frequencyWeight +
      durationScore * durationWeight
    );
  }

  private saveToStorage(): void {
    try {
      const data = Object.fromEntries(this.usage);
      localStorage.setItem("nara-language-analytics", JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save language analytics:", error);
    }
  }

  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem("nara-language-analytics");
      if (stored) {
        const data = JSON.parse(stored);
        this.usage = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn("Failed to load language analytics:", error);
    }
  }
}

const languageAnalytics = new LanguageAnalytics();

// Performance monitoring
interface PerformanceMetrics {
  loadTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  translationMisses: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    translationMisses: 0,
  };
  
  private cacheRequests = 0;
  private cacheHits = 0;
  private translationRequests = 0;
  private missedTranslations = new Set<string>();

  recordCacheHit(): void {
    this.cacheRequests++;
    this.cacheHits++;
    this.updateCacheHitRate();
  }

  recordCacheMiss(): void {
    this.cacheRequests++;
    this.updateCacheHitRate();
  }

  recordTranslationMiss(key: string): void {
    this.translationRequests++;
    this.missedTranslations.add(key);
    this.metrics.translationMisses = this.missedTranslations.size;
  }

  recordLoadTime(time: number): void {
    this.metrics.loadTime = time;
  }

  updateMemoryUsage(): void {
    const stats = translationCache.getStats();
    this.metrics.memoryUsage = stats.size;
  }

  private updateCacheHitRate(): void {
    this.metrics.cacheHitRate = this.cacheRequests > 0 ? this.cacheHits / this.cacheRequests : 0;
  }

  getMetrics(): PerformanceMetrics {
    this.updateMemoryUsage();
    return { ...this.metrics };
  }

  getMissedTranslations(): string[] {
    return Array.from(this.missedTranslations);
  }

  reset(): void {
    this.metrics = {
      loadTime: 0,
      cacheHitRate: 0,
      memoryUsage: 0,
      translationMisses: 0,
    };
    this.cacheRequests = 0;
    this.cacheHits = 0;
    this.translationRequests = 0;
    this.missedTranslations.clear();
  }
}

const performanceMonitor = new PerformanceMonitor();

// Lazy loading functionality
export async function loadTranslationChunk(
  language: SupportedLanguage,
  namespace: string
): Promise<NestedTranslationObject | null> {
  const startTime = performance.now();

  // Try memory cache first
  let translations = translationCache.get(language, namespace);
  if (translations) {
    performanceMonitor.recordCacheHit();
    return translations;
  }

  performanceMonitor.recordCacheMiss();

  // Try persistent cache
  try {
    translations = await persistentCache.get(language, namespace);
    if (translations) {
      // Store in memory cache for faster access
      translationCache.set(language, translations, namespace);
      return translations;
    }
  } catch (error) {
    console.warn("Failed to load from persistent cache:", error);
  }

  // Load from network
  try {
    const response = await fetch(`/locales/${language}/${namespace}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${language}/${namespace}: ${response.status}`);
    }

    translations = await response.json();
    
    // Cache the result if valid
    if (translations) {
      translationCache.set(language, translations, namespace);
      await persistentCache.set(language, translations, namespace).catch(console.warn);
    }

    const loadTime = performance.now() - startTime;
    performanceMonitor.recordLoadTime(loadTime);

    return translations;
  } catch (error) {
    console.error("Failed to load translation chunk:", error);
    return null;
  }
}

// Preloading functionality
export async function preloadLanguages(
  languages: SupportedLanguage[],
  namespaces: string[] = ["common", "navigation"]
): Promise<void> {
  const promises: Promise<any>[] = [];

  for (const language of languages) {
    for (const namespace of namespaces) {
      // Only preload if not already cached
      if (!translationCache.get(language, namespace)) {
        promises.push(
          loadTranslationChunk(language, namespace).catch(error => {
            console.warn(`Failed to preload ${language}/${namespace}:`, error);
          })
        );
      }
    }
  }

  await Promise.all(promises);
}

// Smart preloading based on analytics
export async function smartPreload(currentLanguage: SupportedLanguage): Promise<void> {
  const predictedLanguages = languageAnalytics.predictNextLanguages(currentLanguage);
  
  if (predictedLanguages.length > 0) {
    await preloadLanguages(predictedLanguages);
  }
}

// Bundle optimization
export function getOptimalTranslationBundle(
  primaryLanguage: SupportedLanguage,
  fallbackLanguages: SupportedLanguage[] = []
): {
  critical: SupportedLanguage[];
  prefetch: SupportedLanguage[];
  lazy: SupportedLanguage[];
} {
  const critical = [primaryLanguage];
  const prefetch = fallbackLanguages.slice(0, 2); // First 2 fallbacks
  const lazy = SUPPORTED_LANGUAGES.filter(
    lang => !critical.includes(lang) && !prefetch.includes(lang)
  );

  return { critical, prefetch, lazy };
}

// Cleanup unused translations
export function cleanupUnusedTranslations(): void {
  const stats = languageAnalytics.getUsageStats();
  const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days ago

  for (const [language, data] of stats) {
    if (data.lastUsed < cutoffTime && data.count < 3) {
      // Remove unused language from caches
      translationCache.delete(language);
      persistentCache.delete(language).catch(console.warn);
    }
  }
}

// Initialize performance optimization
export async function initializeI18nPerformance(): Promise<void> {
  // Initialize persistent cache
  await persistentCache.initialize().catch(console.warn);
  
  // Load analytics from storage
  languageAnalytics.loadFromStorage();
  
  // Setup automatic cleanup
  setInterval(cleanupUnusedTranslations, 24 * 60 * 60 * 1000); // Daily cleanup
}

// Export instances for external use
export {
  translationCache,
  persistentCache,
  languageAnalytics,
  performanceMonitor,
};