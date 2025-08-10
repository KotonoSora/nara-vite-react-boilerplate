import { eq } from "drizzle-orm";
import type { Database } from "~/lib/types";
import { userPreference } from "~/database/schema/user";

export interface UserPreferences {
  preferredLanguage: string;
  fallbackLanguages: string[];
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  currency: string;
  theme: "light" | "dark" | "auto";
  notifications: {
    email: boolean;
    security: boolean;
    marketing: boolean;
    updates: boolean;
  };
}

/**
 * Get user preferences with defaults
 */
export async function getUserPreferences(db: Database, userId: number): Promise<UserPreferences> {
  const prefs = await db
    .select()
    .from(userPreference)
    .where(eq(userPreference.userId, userId))
    .get();
  
  if (!prefs) {
    // Return defaults if no preferences found
    return {
      preferredLanguage: "en",
      fallbackLanguages: ["en"],
      timezone: "UTC",
      dateFormat: "MM/dd/yyyy",
      timeFormat: "12h",
      currency: "USD",
      theme: "auto",
      notifications: {
        email: true,
        security: true,
        marketing: false,
        updates: true,
      },
    };
  }
  
  return {
    preferredLanguage: prefs.preferredLanguage,
    fallbackLanguages: prefs.fallbackLanguages ? JSON.parse(prefs.fallbackLanguages) : ["en"],
    timezone: prefs.timezone,
    dateFormat: prefs.dateFormat,
    timeFormat: prefs.timeFormat,
    currency: prefs.currency,
    theme: prefs.theme,
    notifications: prefs.notifications ? JSON.parse(prefs.notifications) : {
      email: true,
      security: true,
      marketing: false,
      updates: true,
    },
  };
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  db: Database, 
  userId: number, 
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> {
  const existing = await db
    .select()
    .from(userPreference)
    .where(eq(userPreference.userId, userId))
    .get();
  
  const currentPrefs = existing ? await getUserPreferences(db, userId) : {
    preferredLanguage: "en",
    fallbackLanguages: ["en"],
    timezone: "UTC",
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12h" as const,
    currency: "USD",
    theme: "auto" as const,
    notifications: {
      email: true,
      security: true,
      marketing: false,
      updates: true,
    },
  };
  
  const updatedPrefs = { ...currentPrefs, ...preferences };
  
  if (existing) {
    await db
      .update(userPreference)
      .set({
        preferredLanguage: updatedPrefs.preferredLanguage,
        fallbackLanguages: JSON.stringify(updatedPrefs.fallbackLanguages),
        timezone: updatedPrefs.timezone,
        dateFormat: updatedPrefs.dateFormat,
        timeFormat: updatedPrefs.timeFormat,
        currency: updatedPrefs.currency,
        theme: updatedPrefs.theme,
        notifications: JSON.stringify(updatedPrefs.notifications),
        updatedAt: new Date(),
      })
      .where(eq(userPreference.userId, userId));
  } else {
    await db
      .insert(userPreference)
      .values({
        userId,
        preferredLanguage: updatedPrefs.preferredLanguage,
        fallbackLanguages: JSON.stringify(updatedPrefs.fallbackLanguages),
        timezone: updatedPrefs.timezone,
        dateFormat: updatedPrefs.dateFormat,
        timeFormat: updatedPrefs.timeFormat,
        currency: updatedPrefs.currency,
        theme: updatedPrefs.theme,
        notifications: JSON.stringify(updatedPrefs.notifications),
      });
  }
  
  return updatedPrefs;
}

/**
 * Get language preference for a user
 */
export async function getUserLanguagePreference(db: Database, userId: number): Promise<{
  preferred: string;
  fallbacks: string[];
}> {
  const prefs = await getUserPreferences(db, userId);
  return {
    preferred: prefs.preferredLanguage,
    fallbacks: prefs.fallbackLanguages,
  };
}

/**
 * Update language preference
 */
export async function updateLanguagePreference(
  db: Database, 
  userId: number, 
  language: string,
  fallbacks?: string[]
) {
  const currentPrefs = await getUserPreferences(db, userId);
  
  await updateUserPreferences(db, userId, {
    preferredLanguage: language,
    fallbackLanguages: fallbacks || [language, ...currentPrefs.fallbackLanguages.filter(l => l !== language)],
  });
}

/**
 * Smart language detection based on user context
 */
export function detectPreferredLanguage(
  acceptLanguageHeader?: string,
  timezone?: string,
  geoLocation?: { country?: string; region?: string }
): {
  detected: string;
  confidence: number;
  alternatives: string[];
} {
  const alternatives: string[] = [];
  let confidence = 0.5; // Base confidence
  let detected = "en"; // Default fallback
  
  // Parse Accept-Language header
  if (acceptLanguageHeader) {
    const languages = acceptLanguageHeader
      .split(",")
      .map(lang => {
        const [code, q] = lang.trim().split(";q=");
        return {
          code: code.split("-")[0].toLowerCase(),
          quality: q ? parseFloat(q) : 1.0,
        };
      })
      .sort((a, b) => b.quality - a.quality);
    
    if (languages.length > 0) {
      detected = languages[0].code;
      confidence = Math.min(0.9, confidence + 0.3);
      alternatives.push(...languages.slice(1, 4).map(l => l.code));
    }
  }
  
  // Enhance with timezone information
  if (timezone) {
    const timezoneLanguageMap: Record<string, string> = {
      "Europe/London": "en",
      "Europe/Paris": "fr",
      "Europe/Berlin": "de",
      "Europe/Madrid": "es",
      "Europe/Rome": "it",
      "Europe/Amsterdam": "nl",
      "Europe/Stockholm": "sv",
      "Europe/Warsaw": "pl",
      "Europe/Prague": "cs",
      "Asia/Tokyo": "ja",
      "Asia/Seoul": "ko",
      "Asia/Shanghai": "zh",
      "Asia/Kolkata": "hi",
      "America/New_York": "en",
      "America/Los_Angeles": "en",
      "America/Mexico_City": "es",
      "America/Sao_Paulo": "pt",
      "America/Buenos_Aires": "es",
    };
    
    const timezoneLanguage = timezoneLanguageMap[timezone];
    if (timezoneLanguage) {
      if (timezoneLanguage === detected) {
        confidence = Math.min(0.95, confidence + 0.2);
      } else {
        alternatives.unshift(timezoneLanguage);
      }
    }
  }
  
  // Enhance with geo location
  if (geoLocation?.country) {
    const countryLanguageMap: Record<string, string> = {
      "US": "en", "GB": "en", "CA": "en", "AU": "en", "NZ": "en",
      "FR": "fr", "BE": "fr", "CH": "fr", "LU": "fr",
      "DE": "de", "AT": "de",
      "ES": "es", "MX": "es", "AR": "es", "CO": "es", "PE": "es",
      "IT": "it",
      "NL": "nl",
      "SE": "sv",
      "NO": "no",
      "DK": "da",
      "FI": "fi",
      "PL": "pl",
      "CZ": "cs",
      "JP": "ja",
      "KR": "ko",
      "CN": "zh", "TW": "zh", "HK": "zh",
      "IN": "hi",
      "BR": "pt", "PT": "pt",
      "RU": "ru",
      "TR": "tr",
      "SA": "ar", "EG": "ar", "AE": "ar",
    };
    
    const countryLanguage = countryLanguageMap[geoLocation.country.toUpperCase()];
    if (countryLanguage) {
      if (countryLanguage === detected) {
        confidence = Math.min(0.98, confidence + 0.2);
      } else {
        alternatives.unshift(countryLanguage);
      }
    }
  }
  
  // Remove duplicates and limit alternatives
  const uniqueAlternatives = Array.from(new Set(alternatives))
    .filter(lang => lang !== detected)
    .slice(0, 3);
  
  return {
    detected,
    confidence,
    alternatives: uniqueAlternatives,
  };
}

/**
 * Format date according to user preferences
 */
export function formatDateWithPreferences(
  date: Date,
  preferences: UserPreferences,
  options: {
    includeTime?: boolean;
    relative?: boolean;
  } = {}
): string {
  const { timezone, dateFormat, timeFormat } = preferences;
  
  try {
    // Create formatter for the user's timezone
    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
    };
    
    // Configure date format
    if (dateFormat === "MM/dd/yyyy") {
      dateOptions.month = "2-digit";
      dateOptions.day = "2-digit";
      dateOptions.year = "numeric";
    } else if (dateFormat === "dd/MM/yyyy") {
      dateOptions.day = "2-digit";
      dateOptions.month = "2-digit";
      dateOptions.year = "numeric";
    } else if (dateFormat === "yyyy-MM-dd") {
      dateOptions.year = "numeric";
      dateOptions.month = "2-digit";
      dateOptions.day = "2-digit";
    } else {
      dateOptions.dateStyle = "medium";
    }
    
    // Add time if requested
    if (options.includeTime) {
      dateOptions.hour = "2-digit";
      dateOptions.minute = "2-digit";
      dateOptions.hour12 = timeFormat === "12h";
    }
    
    // Use relative formatting if requested and recent
    if (options.relative) {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours < 24) {
        const rtf = new Intl.RelativeTimeFormat(preferences.preferredLanguage, { numeric: "auto" });
        
        if (diffHours < 1) {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          return rtf.format(-diffMinutes, "minute");
        } else {
          return rtf.format(-Math.floor(diffHours), "hour");
        }
      }
    }
    
    return new Intl.DateTimeFormat(preferences.preferredLanguage, dateOptions).format(date);
  } catch (error) {
    // Fallback to ISO string if formatting fails
    console.error("Date formatting error:", error);
    return date.toISOString().split("T")[0];
  }
}

/**
 * Format currency according to user preferences
 */
export function formatCurrencyWithPreferences(
  amount: number,
  preferences: UserPreferences
): string {
  try {
    return new Intl.NumberFormat(preferences.preferredLanguage, {
      style: "currency",
      currency: preferences.currency,
    }).format(amount);
  } catch (error) {
    // Fallback to simple format
    console.error("Currency formatting error:", error);
    return `${preferences.currency} ${amount.toFixed(2)}`;
  }
}