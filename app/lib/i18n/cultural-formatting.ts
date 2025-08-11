import type { SupportedLanguage } from "./config";

import { getLocaleFromLanguage } from "./formatting";

// Cultural address formatting patterns
export interface AddressFormat {
  order: string[]; // Order of address components
  separator: string; // Main separator between components
  lineSeparator: string; // Line break separator
  postalCodeFormat?: RegExp; // Postal code validation pattern
}

export const ADDRESS_FORMATS: Record<SupportedLanguage, AddressFormat> = {
  en: {
    order: ["name", "street", "city", "state", "postalCode", "country"],
    separator: ", ",
    lineSeparator: "\n",
    postalCodeFormat: /^\d{5}(-\d{4})?$/, // US ZIP code
  },
  es: {
    order: ["name", "street", "postalCode", "city", "state", "country"],
    separator: ", ",
    lineSeparator: "\n",
    postalCodeFormat: /^\d{5}$/, // Spanish postal code
  },
  fr: {
    order: ["name", "street", "postalCode", "city", "country"],
    separator: ", ",
    lineSeparator: "\n",
    postalCodeFormat: /^\d{5}$/, // French postal code
  },
  zh: {
    order: ["country", "state", "city", "street", "name", "postalCode"],
    separator: " ",
    lineSeparator: "\n",
    postalCodeFormat: /^\d{6}$/, // Chinese postal code
  },
  hi: {
    order: ["name", "street", "city", "state", "postalCode", "country"],
    separator: ", ",
    lineSeparator: "\n",
    postalCodeFormat: /^\d{6}$/, // Indian PIN code
  },
  ar: {
    order: ["name", "street", "city", "state", "postalCode", "country"],
    separator: "، ", // Arabic comma
    lineSeparator: "\n",
    postalCodeFormat: /^\d{5}$/, // Arabic countries postal code
  },
  vi: {
    order: ["name", "street", "city", "state", "postalCode", "country"],
    separator: ", ",
    lineSeparator: "\n",
    postalCodeFormat: /^\d{6}$/, // Vietnamese postal code
  },
  ja: {
    order: ["postalCode", "country", "state", "city", "street", "name"],
    separator: " ",
    lineSeparator: "\n",
    postalCodeFormat: /^\d{3}-\d{4}$/, // Japanese postal code
  },
  th: {
    order: ["name", "street", "city", "state", "postalCode", "country"],
    separator: " ",
    lineSeparator: "\n",
    postalCodeFormat: /^\d{5}$/, // Thai postal code
  },
};

// Phone number formatting patterns
export interface PhoneFormat {
  pattern: RegExp;
  format: string; // Format string with placeholders
  example: string;
  countryCode: string;
}

export const PHONE_FORMATS: Record<SupportedLanguage, PhoneFormat> = {
  en: {
    pattern: /^(\d{3})(\d{3})(\d{4})$/,
    format: "($1) $2-$3",
    example: "(555) 123-4567",
    countryCode: "+1",
  },
  es: {
    pattern: /^(\d{3})(\d{2})(\d{2})(\d{2})$/,
    format: "$1 $2 $3 $4",
    example: "912 34 56 78",
    countryCode: "+34",
  },
  fr: {
    pattern: /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
    format: "$1 $2 $3 $4 $5",
    example: "01 23 45 67 89",
    countryCode: "+33",
  },
  zh: {
    pattern: /^(\d{3})(\d{4})(\d{4})$/,
    format: "$1 $2 $3",
    example: "138 0013 8000",
    countryCode: "+86",
  },
  hi: {
    pattern: /^(\d{5})(\d{5})$/,
    format: "$1 $2",
    example: "98765 43210",
    countryCode: "+91",
  },
  ar: {
    pattern: /^(\d{2})(\d{3})(\d{4})$/,
    format: "$1 $2 $3",
    example: "50 123 4567",
    countryCode: "+966",
  },
  vi: {
    pattern: /^(\d{3})(\d{3})(\d{4})$/,
    format: "$1 $2 $3",
    example: "090 123 4567",
    countryCode: "+84",
  },
  ja: {
    pattern: /^(\d{3})(\d{4})(\d{4})$/,
    format: "$1-$2-$3",
    example: "090-1234-5678",
    countryCode: "+81",
  },
  th: {
    pattern: /^(\d{3})(\d{3})(\d{4})$/,
    format: "$1-$2-$3",
    example: "081-234-5678",
    countryCode: "+66",
  },
};

// Name formatting conventions
export interface NameFormat {
  order: string[]; // Order of name components
  separator: string;
  honorifics: string[];
  example: string;
}

export const NAME_FORMATS: Record<SupportedLanguage, NameFormat> = {
  en: {
    order: ["first", "middle", "last"],
    separator: " ",
    honorifics: ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."],
    example: "John M. Smith",
  },
  es: {
    order: ["first", "middle", "last", "maternal"],
    separator: " ",
    honorifics: ["Sr.", "Sra.", "Srta.", "Dr.", "Dra."],
    example: "Juan Carlos García López",
  },
  fr: {
    order: ["first", "middle", "last"],
    separator: " ",
    honorifics: ["M.", "Mme", "Mlle", "Dr", "Pr"],
    example: "Jean-Pierre Dupont",
  },
  zh: {
    order: ["last", "first"],
    separator: "",
    honorifics: ["先生", "女士", "小姐", "博士", "教授"],
    example: "王小明",
  },
  hi: {
    order: ["first", "middle", "last"],
    separator: " ",
    honorifics: ["श्री", "श्रीमती", "कुमारी", "डॉ.", "प्रो."],
    example: "राम कुमार शर्मा",
  },
  ar: {
    order: ["first", "father", "grandfather", "family"],
    separator: " ",
    honorifics: ["السيد", "السيدة", "الآنسة", "الدكتور", "الأستاذ"],
    example: "أحمد محمد علي الخالدي",
  },
  vi: {
    order: ["last", "middle", "first"],
    separator: " ",
    honorifics: ["Ông", "Bà", "Cô", "Tiến sĩ", "Giáo sư"],
    example: "Nguyễn Văn An",
  },
  ja: {
    order: ["last", "first"],
    separator: " ",
    honorifics: ["さん", "様", "先生", "博士", "教授"],
    example: "田中太郎",
  },
  th: {
    order: ["first", "last"],
    separator: " ",
    honorifics: ["นาย", "นาง", "นางสาว", "ดร.", "ศ."],
    example: "สมชาย ใจดี",
  },
};

// Cultural color preferences
export const CULTURAL_COLORS: Record<
  SupportedLanguage,
  {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    auspicious: string[];
    inauspicious: string[];
  }
> = {
  en: {
    primary: "#3B82F6", // Blue
    success: "#10B981", // Green
    warning: "#F59E0B", // Amber
    danger: "#EF4444", // Red
    auspicious: ["#10B981", "#3B82F6"], // Green, Blue
    inauspicious: ["#EF4444"], // Red
  },
  es: {
    primary: "#DC2626", // Red (Spanish flag)
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    auspicious: ["#10B981", "#F59E0B"], // Green, Gold
    inauspicious: ["#000000"], // Black
  },
  fr: {
    primary: "#3B82F6", // Blue (French flag)
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    auspicious: ["#3B82F6", "#FFFFFF", "#EF4444"], // French tricolor
    inauspicious: [],
  },
  zh: {
    primary: "#DC2626", // Red (auspicious)
    success: "#F59E0B", // Gold
    warning: "#F59E0B",
    danger: "#000000", // Black
    auspicious: ["#DC2626", "#F59E0B"], // Red, Gold
    inauspicious: ["#FFFFFF", "#000000"], // White, Black (funerals)
  },
  hi: {
    primary: "#F97316", // Saffron
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    auspicious: ["#F97316", "#F59E0B", "#DC2626"], // Saffron, Gold, Red
    inauspicious: ["#000000", "#FFFFFF"], // Black, White
  },
  ar: {
    primary: "#10B981", // Green (Islamic)
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    auspicious: ["#10B981", "#F59E0B"], // Green, Gold
    inauspicious: [],
  },
  vi: {
    primary: "#DC2626", // Red (auspicious)
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    auspicious: ["#DC2626", "#F59E0B"], // Red, Gold
    inauspicious: ["#FFFFFF", "#000000"], // White, Black
  },
  ja: {
    primary: "#DC2626", // Red
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    auspicious: ["#DC2626", "#FFFFFF"], // Red, White
    inauspicious: ["#000000"], // Black
  },
  th: {
    primary: "#3B82F6", // Blue (royal)
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    auspicious: ["#F59E0B", "#3B82F6"], // Gold, Blue
    inauspicious: [],
  },
};

// Address interface
export interface Address {
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

/**
 * Format address according to cultural conventions
 */
export function formatAddress(
  address: Address,
  language: SupportedLanguage,
  options: { multiline?: boolean; includeCountry?: boolean } = {},
): string {
  const format = ADDRESS_FORMATS[language];
  const { multiline = false, includeCountry = true } = options;

  const components: string[] = [];

  for (const component of format.order) {
    const value = address[component as keyof Address];
    if (value && (component !== "country" || includeCountry)) {
      components.push(value);
    }
  }

  if (multiline) {
    // Group components for multiline formatting
    const lines: string[] = [];
    if (address.name) lines.push(address.name);
    if (address.street) lines.push(address.street);

    const cityLine: string[] = [];
    if (language === "zh" || language === "ja") {
      // Asian format: postal code first
      if (address.postalCode) cityLine.push(address.postalCode);
      if (address.city) cityLine.push(address.city);
      if (address.state) cityLine.push(address.state);
    } else {
      // Western format: city, state postal code
      if (address.city) cityLine.push(address.city);
      if (address.state) cityLine.push(address.state);
      if (address.postalCode) cityLine.push(address.postalCode);
    }

    if (cityLine.length > 0) {
      lines.push(cityLine.join(format.separator));
    }

    if (address.country && includeCountry) {
      lines.push(address.country);
    }

    return lines.join(format.lineSeparator);
  }

  return components.join(format.separator);
}

/**
 * Format phone number according to cultural conventions
 */
export function formatPhoneNumber(
  phoneNumber: string,
  language: SupportedLanguage,
  options: { includeCountryCode?: boolean; international?: boolean } = {},
): string {
  const format = PHONE_FORMATS[language];
  const { includeCountryCode = false, international = false } = options;

  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, "");

  // Apply regional formatting
  const match = digits.match(format.pattern);
  if (match) {
    let formatted = format.format.replace(
      /\$(\d+)/g,
      (_, group) => match[parseInt(group)],
    );

    if (includeCountryCode || international) {
      formatted = `${format.countryCode} ${formatted}`;
    }

    return formatted;
  }

  // Return original if no pattern match
  return phoneNumber;
}

/**
 * Format name according to cultural conventions
 */
export function formatName(
  name: {
    first?: string;
    middle?: string;
    last?: string;
    father?: string;
    grandfather?: string;
    family?: string;
    maternal?: string;
  },
  language: SupportedLanguage,
  options: { honorific?: string; formal?: boolean } = {},
): string {
  const format = NAME_FORMATS[language];
  const { honorific, formal = false } = options;

  const components: string[] = [];

  if (honorific && format.honorifics.includes(honorific)) {
    components.push(honorific);
  }

  for (const component of format.order) {
    const value = name[component as keyof typeof name];
    if (value) {
      // For formal names, only use initials for middle names in Western cultures
      if (
        formal &&
        component === "middle" &&
        (language === "en" || language === "es" || language === "fr")
      ) {
        components.push(value.charAt(0) + ".");
      } else {
        components.push(value);
      }
    }
  }

  return components.join(format.separator);
}

/**
 * Validate postal code format for a language
 */
export function validatePostalCode(
  postalCode: string,
  language: SupportedLanguage,
): boolean {
  const format = ADDRESS_FORMATS[language];
  if (!format.postalCodeFormat) return true; // No validation pattern

  return format.postalCodeFormat.test(postalCode);
}

/**
 * Get cultural color for a semantic meaning
 */
export function getCulturalColor(
  semantic: "primary" | "success" | "warning" | "danger",
  language: SupportedLanguage,
): string {
  return CULTURAL_COLORS[language][semantic];
}

/**
 * Check if a color is culturally appropriate
 */
export function isColorCulturallyAppropriate(
  color: string,
  language: SupportedLanguage,
  context: "general" | "celebration" | "mourning" = "general",
): { appropriate: boolean; reason?: string } {
  const colors = CULTURAL_COLORS[language];

  if (context === "mourning") {
    if (colors.inauspicious.includes(color.toUpperCase())) {
      return { appropriate: true };
    }
    if (colors.auspicious.includes(color.toUpperCase())) {
      return {
        appropriate: false,
        reason: "This color is associated with celebrations",
      };
    }
  }

  if (context === "celebration") {
    if (colors.auspicious.includes(color.toUpperCase())) {
      return { appropriate: true };
    }
    if (colors.inauspicious.includes(color.toUpperCase())) {
      return {
        appropriate: false,
        reason: "This color is considered inauspicious",
      };
    }
  }

  return { appropriate: true };
}

/**
 * Get example formatting for documentation
 */
export function getFormattingExamples(language: SupportedLanguage) {
  return {
    address: formatAddress(
      {
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
      language,
      { multiline: true },
    ),
    phone: formatPhoneNumber("1234567890", language, {
      includeCountryCode: true,
    }),
    name: formatName(
      { first: "John", middle: "Michael", last: "Doe" },
      language,
      { formal: true },
    ),
    colors: CULTURAL_COLORS[language],
  };
}
