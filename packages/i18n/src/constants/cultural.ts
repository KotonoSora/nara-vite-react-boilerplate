import type { SupportedLanguage } from "../types/common";
import type { AddressFormat, NameFormat, PhoneFormat } from "../types/cultural";

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
