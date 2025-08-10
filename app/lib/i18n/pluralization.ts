import type { SupportedLanguage } from "./config";

// Pluralization rules for different languages
// Based on Unicode CLDR plural rules: https://cldr.unicode.org/

export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export interface PluralRules {
  [key: string]: {
    zero?: string;
    one?: string;
    two?: string;
    few?: string;
    many?: string;
    other: string; // fallback, required
  };
}

// Get plural category for a number in a specific language
export function getPluralCategory(
  count: number,
  language: SupportedLanguage
): PluralCategory {
  const localeMap: Record<SupportedLanguage, string> = {
    en: "en",
    es: "es", 
    fr: "fr",
    zh: "zh",
    hi: "hi",
    ar: "ar",
    vi: "vi",
    ja: "ja",
    th: "th",
  };

  const locale = localeMap[language];
  const pr = new Intl.PluralRules(locale);
  return pr.select(count) as PluralCategory;
}

// Get pluralized string based on count and language
export function pluralize(
  count: number,
  language: SupportedLanguage,
  forms: Partial<Record<PluralCategory, string>> & { other: string },
  includeCount: boolean = true
): string {
  const category = getPluralCategory(count, language);
  const form = forms[category] || forms.other;
  
  if (includeCount) {
    return form.replace(/{{count}}/g, count.toString());
  }
  
  return form;
}

// Common pluralization patterns for each language
export const COMMON_PLURALS: Record<SupportedLanguage, PluralRules> = {
  en: {
    items: {
      one: "{{count}} item",
      other: "{{count}} items"
    },
    users: {
      one: "{{count}} user",
      other: "{{count}} users"
    },
    days: {
      one: "{{count}} day",
      other: "{{count}} days"
    },
    hours: {
      one: "{{count}} hour", 
      other: "{{count}} hours"
    },
    minutes: {
      one: "{{count}} minute",
      other: "{{count}} minutes"
    },
    seconds: {
      one: "{{count}} second",
      other: "{{count}} seconds"
    },
    comments: {
      zero: "No comments",
      one: "{{count}} comment",
      other: "{{count}} comments"
    },
    likes: {
      zero: "No likes",
      one: "{{count}} like", 
      other: "{{count}} likes"
    }
  },
  es: {
    items: {
      one: "{{count}} artículo",
      other: "{{count}} artículos"
    },
    users: {
      one: "{{count}} usuario",
      other: "{{count}} usuarios"
    },
    days: {
      one: "{{count}} día",
      other: "{{count}} días"
    },
    hours: {
      one: "{{count}} hora",
      other: "{{count}} horas"
    },
    minutes: {
      one: "{{count}} minuto",
      other: "{{count}} minutos"
    },
    seconds: {
      one: "{{count}} segundo",
      other: "{{count}} segundos"
    },
    comments: {
      zero: "Sin comentarios",
      one: "{{count}} comentario",
      other: "{{count}} comentarios"
    },
    likes: {
      zero: "Sin me gusta",
      one: "{{count}} me gusta",
      other: "{{count}} me gusta"
    }
  },
  fr: {
    items: {
      one: "{{count}} élément",
      other: "{{count}} éléments"
    },
    users: {
      one: "{{count}} utilisateur",
      other: "{{count}} utilisateurs"
    },
    days: {
      one: "{{count}} jour",
      other: "{{count}} jours"
    },
    hours: {
      one: "{{count}} heure",
      other: "{{count}} heures"
    },
    minutes: {
      one: "{{count}} minute",
      other: "{{count}} minutes"
    },
    seconds: {
      one: "{{count}} seconde",
      other: "{{count}} secondes"
    },
    comments: {
      zero: "Aucun commentaire",
      one: "{{count}} commentaire",
      other: "{{count}} commentaires"
    },
    likes: {
      zero: "Aucun j'aime",
      one: "{{count}} j'aime",
      other: "{{count}} j'aime"
    }
  },
  zh: {
    items: {
      other: "{{count}} 个项目"
    },
    users: {
      other: "{{count}} 个用户"
    },
    days: {
      other: "{{count}} 天"
    },
    hours: {
      other: "{{count}} 小时"
    },
    minutes: {
      other: "{{count}} 分钟"
    },
    seconds: {
      other: "{{count}} 秒"
    },
    comments: {
      zero: "无评论",
      other: "{{count}} 条评论"
    },
    likes: {
      zero: "无点赞",
      other: "{{count}} 个赞"
    }
  },
  hi: {
    items: {
      one: "{{count}} आइटम",
      other: "{{count}} आइटम"
    },
    users: {
      one: "{{count}} उपयोगकर्ता",
      other: "{{count}} उपयोगकर्ता"
    },
    days: {
      one: "{{count}} दिन",
      other: "{{count}} दिन"
    },
    hours: {
      one: "{{count}} घंटा",
      other: "{{count}} घंटे"
    },
    minutes: {
      one: "{{count}} मिनट",
      other: "{{count}} मिनट"
    },
    seconds: {
      one: "{{count}} सेकंड",
      other: "{{count}} सेकंड"
    },
    comments: {
      zero: "कोई टिप्पणी नहीं",
      one: "{{count}} टिप्पणी",
      other: "{{count}} टिप्पणियां"
    },
    likes: {
      zero: "कोई लाइक नहीं",
      one: "{{count}} लाइक",
      other: "{{count}} लाइक"
    }
  },
  ar: {
    items: {
      zero: "لا توجد عناصر",
      one: "عنصر واحد",
      two: "عنصران",
      few: "{{count}} عناصر",
      many: "{{count}} عنصراً",
      other: "{{count}} عنصر"
    },
    users: {
      zero: "لا يوجد مستخدمون",
      one: "مستخدم واحد",
      two: "مستخدمان",
      few: "{{count}} مستخدمين",
      many: "{{count}} مستخدماً",
      other: "{{count}} مستخدم"
    },
    days: {
      zero: "لا توجد أيام",
      one: "يوم واحد",
      two: "يومان",
      few: "{{count}} أيام",
      many: "{{count}} يوماً",
      other: "{{count}} يوم"
    },
    comments: {
      zero: "لا توجد تعليقات",
      one: "تعليق واحد",
      two: "تعليقان",
      few: "{{count}} تعليقات",
      many: "{{count}} تعليقاً",
      other: "{{count}} تعليق"
    }
  },
  vi: {
    items: {
      other: "{{count}} mục"
    },
    users: {
      other: "{{count}} người dùng"
    },
    days: {
      other: "{{count}} ngày"
    },
    hours: {
      other: "{{count}} giờ"
    },
    minutes: {
      other: "{{count}} phút"
    },
    seconds: {
      other: "{{count}} giây"
    },
    comments: {
      zero: "Không có bình luận",
      other: "{{count}} bình luận"
    },
    likes: {
      zero: "Không có lượt thích",
      other: "{{count}} lượt thích"
    }
  },
  ja: {
    items: {
      other: "{{count}}個のアイテム"
    },
    users: {
      other: "{{count}}人のユーザー"
    },
    days: {
      other: "{{count}}日"
    },
    hours: {
      other: "{{count}}時間"
    },
    minutes: {
      other: "{{count}}分"
    },
    seconds: {
      other: "{{count}}秒"
    },
    comments: {
      zero: "コメントなし",
      other: "{{count}}件のコメント"
    },
    likes: {
      zero: "いいねなし", 
      other: "{{count}}件のいいね"
    }
  },
  th: {
    items: {
      other: "{{count}} รายการ"
    },
    users: {
      other: "{{count}} ผู้ใช้"
    },
    days: {
      other: "{{count}} วัน"
    },
    hours: {
      other: "{{count}} ชั่วโมง"
    },
    minutes: {
      other: "{{count}} นาที"
    },
    seconds: {
      other: "{{count}} วินาที"
    },
    comments: {
      zero: "ไม่มีความคิดเห็น",
      other: "{{count}} ความคิดเห็น"
    },
    likes: {
      zero: "ไม่มีการถูกใจ",
      other: "{{count}} การถูกใจ"
    }
  }
};

// Helper function to get common plural
export function getCommonPlural(
  key: string,
  count: number, 
  language: SupportedLanguage,
  includeCount: boolean = true
): string {
  const pluralRules = COMMON_PLURALS[language];
  const forms = pluralRules[key];
  
  if (!forms) {
    console.warn(`No plural forms found for key: ${key} in language: ${language}`);
    return `${count} ${key}`;
  }
  
  return pluralize(count, language, forms, includeCount);
}

// Create a pluralization function for a specific language
export function createPluralFunction(language: SupportedLanguage) {
  return (
    key: string, 
    count: number, 
    customForms?: Partial<Record<PluralCategory, string>> & { other: string },
    includeCount: boolean = true
  ) => {
    if (customForms) {
      return pluralize(count, language, customForms, includeCount);
    }
    return getCommonPlural(key, count, language, includeCount);
  };
}