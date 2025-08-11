import type { SupportedLanguage } from "./config";

import { isRTLLanguage } from "./config";

// Screen reader language codes (different from our language codes)
export const SCREEN_READER_LANGUAGES: Record<SupportedLanguage, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  zh: "zh-CN",
  hi: "hi-IN",
  ar: "ar-SA",
  vi: "vi-VN",
  ja: "ja-JP",
  th: "th-TH",
} as const;

// Screen reader announcements for language changes
export const LANGUAGE_CHANGE_ANNOUNCEMENTS: Record<SupportedLanguage, string> =
  {
    en: "Language changed to English",
    es: "Idioma cambiado a español",
    fr: "Langue changée en français",
    zh: "语言已更改为中文",
    hi: "भाषा हिंदी में बदल गई",
    ar: "تم تغيير اللغة إلى العربية",
    vi: "Đã chuyển ngôn ngữ sang tiếng Việt",
    ja: "言語が日本語に変更されました",
    th: "เปลี่ยนภาษาเป็นไทยแล้ว",
  } as const;

// Direction change announcements
export const DIRECTION_CHANGE_ANNOUNCEMENTS: Record<SupportedLanguage, string> =
  {
    en: "Text direction changed to left-to-right",
    es: "Dirección del texto cambiada a izquierda-a-derecha",
    fr: "Direction du texte changée de gauche à droite",
    zh: "文本方向已更改为从左到右",
    hi: "टेक्स्ट दिशा बाएं से दाएं में बदल गई",
    ar: "تم تغيير اتجاه النص إلى من اليمين إلى اليسار",
    vi: "Hướng văn bản đã chuyển từ trái sang phải",
    ja: "テキスト方向が左から右に変更されました",
    th: "ทิศทางข้อความเปลี่ยนจากซ้ายไปขวา",
  } as const;

// Keyboard shortcuts by language
export interface KeyboardShortcuts {
  languageSwitcher: string[];
  navigation: Record<string, string[]>;
  textFormatting: Record<string, string[]>;
}

export const LANGUAGE_KEYBOARD_SHORTCUTS: Record<
  SupportedLanguage,
  KeyboardShortcuts
> = {
  en: {
    languageSwitcher: ["Alt+L", "Ctrl+Shift+L"],
    navigation: {
      home: ["Alt+H"],
      search: ["Alt+S", "/"],
      menu: ["Alt+M"],
    },
    textFormatting: {
      bold: ["Ctrl+B"],
      italic: ["Ctrl+I"],
      underline: ["Ctrl+U"],
    },
  },
  es: {
    languageSwitcher: ["Alt+L", "Ctrl+Shift+L"],
    navigation: {
      inicio: ["Alt+I"],
      buscar: ["Alt+B", "/"],
      menu: ["Alt+M"],
    },
    textFormatting: {
      negrita: ["Ctrl+B"],
      cursiva: ["Ctrl+I"],
      subrayado: ["Ctrl+U"],
    },
  },
  fr: {
    languageSwitcher: ["Alt+L", "Ctrl+Shift+L"],
    navigation: {
      accueil: ["Alt+A"],
      recherche: ["Alt+R", "/"],
      menu: ["Alt+M"],
    },
    textFormatting: {
      gras: ["Ctrl+B"],
      italique: ["Ctrl+I"],
      souligner: ["Ctrl+U"],
    },
  },
  zh: {
    languageSwitcher: ["Alt+语言", "Ctrl+Shift+L"],
    navigation: {
      首页: ["Alt+首"],
      搜索: ["Alt+搜", "/"],
      菜单: ["Alt+菜"],
    },
    textFormatting: {
      粗体: ["Ctrl+B"],
      斜体: ["Ctrl+I"],
      下划线: ["Ctrl+U"],
    },
  },
  hi: {
    languageSwitcher: ["Alt+भाषा", "Ctrl+Shift+L"],
    navigation: {
      मुखपृष्ठ: ["Alt+म"],
      खोज: ["Alt+ख", "/"],
      मेनू: ["Alt+मे"],
    },
    textFormatting: {
      मोटा: ["Ctrl+B"],
      तिर्छा: ["Ctrl+I"],
      रेखांकित: ["Ctrl+U"],
    },
  },
  ar: {
    languageSwitcher: ["Alt+لغة", "Ctrl+Shift+L"],
    navigation: {
      الرئيسية: ["Alt+ر"],
      البحث: ["Alt+ب", "/"],
      القائمة: ["Alt+ق"],
    },
    textFormatting: {
      عريض: ["Ctrl+B"],
      مائل: ["Ctrl+I"],
      تسطير: ["Ctrl+U"],
    },
  },
  vi: {
    languageSwitcher: ["Alt+Ngôn ngữ", "Ctrl+Shift+L"],
    navigation: {
      trangChủ: ["Alt+T"],
      tìmKiếm: ["Alt+K", "/"],
      thựcĐơn: ["Alt+Đ"],
    },
    textFormatting: {
      đậm: ["Ctrl+B"],
      nghiêng: ["Ctrl+I"],
      gạchChân: ["Ctrl+U"],
    },
  },
  ja: {
    languageSwitcher: ["Alt+言語", "Ctrl+Shift+L"],
    navigation: {
      ホーム: ["Alt+ホ"],
      検索: ["Alt+検", "/"],
      メニュー: ["Alt+メ"],
    },
    textFormatting: {
      太字: ["Ctrl+B"],
      斜体: ["Ctrl+I"],
      下線: ["Ctrl+U"],
    },
  },
  th: {
    languageSwitcher: ["Alt+ภาษา", "Ctrl+Shift+L"],
    navigation: {
      หน้าแรก: ["Alt+ห"],
      ค้นหา: ["Alt+ค", "/"],
      เมนู: ["Alt+เ"],
    },
    textFormatting: {
      ตัวหนา: ["Ctrl+B"],
      ตัวเอียง: ["Ctrl+I"],
      ขีดเส้นใต้: ["Ctrl+U"],
    },
  },
};

// Voice input languages
export const VOICE_INPUT_LANGUAGES: Record<SupportedLanguage, string[]> = {
  en: ["en-US", "en-GB", "en-AU", "en-CA"],
  es: ["es-ES", "es-MX", "es-AR", "es-CO"],
  fr: ["fr-FR", "fr-CA", "fr-BE", "fr-CH"],
  zh: ["zh-CN", "zh-TW", "zh-HK"],
  hi: ["hi-IN"],
  ar: ["ar-SA", "ar-AE", "ar-EG"],
  vi: ["vi-VN"],
  ja: ["ja-JP"],
  th: ["th-TH"],
} as const;

/**
 * Create ARIA announcement for language change
 */
export function createLanguageChangeAnnouncement(
  newLanguage: SupportedLanguage,
  previousLanguage?: SupportedLanguage,
): string {
  const announcement = LANGUAGE_CHANGE_ANNOUNCEMENTS[newLanguage];

  // If direction changed, add direction announcement
  const newDirection = isRTLLanguage(newLanguage) ? "rtl" : "ltr";
  const previousDirection = previousLanguage
    ? isRTLLanguage(previousLanguage)
      ? "rtl"
      : "ltr"
    : "ltr";

  if (newDirection !== previousDirection) {
    const directionAnnouncement = DIRECTION_CHANGE_ANNOUNCEMENTS[newLanguage];
    return `${announcement}. ${directionAnnouncement}`;
  }

  return announcement;
}

/**
 * Announce text to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite",
  language?: SupportedLanguage,
): void {
  // Create or get existing announcer element
  let announcer = document.getElementById(
    "nara-screen-reader-announcer",
  ) as HTMLElement;

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "nara-screen-reader-announcer";
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only"; // Screen reader only
    announcer.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    document.body.appendChild(announcer);
  }

  // Set language if provided
  if (language) {
    announcer.lang = SCREEN_READER_LANGUAGES[language];
  }

  // Update aria-live if needed
  if (announcer.getAttribute("aria-live") !== priority) {
    announcer.setAttribute("aria-live", priority);
  }

  // Clear and set new message
  announcer.textContent = "";
  setTimeout(() => {
    announcer.textContent = message;
  }, 100); // Small delay to ensure screen reader picks up the change
}

/**
 * Get keyboard shortcuts for current language
 */
export function getKeyboardShortcuts(
  language: SupportedLanguage,
): KeyboardShortcuts {
  return LANGUAGE_KEYBOARD_SHORTCUTS[language];
}

/**
 * Register keyboard shortcuts for a language
 */
export function registerKeyboardShortcuts(
  language: SupportedLanguage,
  handlers: {
    languageSwitcher?: () => void;
    navigation?: Record<string, () => void>;
    textFormatting?: Record<string, () => void>;
  },
): () => void {
  const shortcuts = getKeyboardShortcuts(language);
  const listeners: Array<{
    element: Document | HTMLElement;
    event: string;
    handler: (e: Event) => void;
  }> = [];

  const handleKeydown = (event: KeyboardEvent) => {
    const key = event.key;
    const combo = [
      event.ctrlKey && "Ctrl",
      event.altKey && "Alt",
      event.shiftKey && "Shift",
      key !== "Control" && key !== "Alt" && key !== "Shift" && key,
    ]
      .filter(Boolean)
      .join("+");

    // Check language switcher shortcuts
    if (
      handlers.languageSwitcher &&
      shortcuts.languageSwitcher.includes(combo)
    ) {
      event.preventDefault();
      handlers.languageSwitcher();
      return;
    }

    // Check navigation shortcuts
    if (handlers.navigation) {
      for (const [action, shortcutKeys] of Object.entries(
        shortcuts.navigation,
      )) {
        if (shortcutKeys.includes(combo) && handlers.navigation[action]) {
          event.preventDefault();
          handlers.navigation[action]();
          return;
        }
      }
    }

    // Check text formatting shortcuts
    if (handlers.textFormatting) {
      for (const [action, shortcutKeys] of Object.entries(
        shortcuts.textFormatting,
      )) {
        if (shortcutKeys.includes(combo) && handlers.textFormatting[action]) {
          event.preventDefault();
          handlers.textFormatting[action]();
          return;
        }
      }
    }
  };

  document.addEventListener("keydown", handleKeydown as any);
  listeners.push({
    element: document,
    event: "keydown",
    handler: handleKeydown as any,
  });

  // Return cleanup function
  return () => {
    listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler as any);
    });
  };
}

/**
 * Set focus with announcement
 */
export function setFocusWithAnnouncement(
  element: HTMLElement,
  announcement?: string,
  language?: SupportedLanguage,
): void {
  element.focus();

  if (announcement) {
    // Small delay to allow focus to settle
    setTimeout(() => {
      announceToScreenReader(announcement, "polite", language);
    }, 100);
  }
}

/**
 * Create accessible skip links
 */
export function createSkipLinks(
  language: SupportedLanguage,
  targets: Array<{ id: string; label: string }>,
): HTMLElement {
  const skipLinksContainer = document.createElement("nav");
  skipLinksContainer.className = "skip-links";
  skipLinksContainer.setAttribute("aria-label", getSkipLinksLabel(language));

  const skipList = document.createElement("ul");
  skipList.className = "skip-links-list";

  targets.forEach(({ id, label }) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = label;
    link.className = "skip-link";

    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.getElementById(id);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: "smooth" });
        announceToScreenReader(`Skipped to ${label}`, "assertive", language);
      }
    });

    listItem.appendChild(link);
    skipList.appendChild(listItem);
  });

  skipLinksContainer.appendChild(skipList);
  return skipLinksContainer;
}

/**
 * Get skip links label by language
 */
function getSkipLinksLabel(language: SupportedLanguage): string {
  const labels: Record<SupportedLanguage, string> = {
    en: "Skip to main content",
    es: "Saltar al contenido principal",
    fr: "Passer au contenu principal",
    zh: "跳转到主要内容",
    hi: "मुख्य सामग्री पर जाएं",
    ar: "انتقل إلى المحتوى الرئيسي",
    vi: "Chuyển đến nội dung chính",
    ja: "メインコンテンツにスキップ",
    th: "ข้ามไปยังเนื้อหาหลัก",
  };

  return labels[language];
}

/**
 * Setup voice input for language
 */
export function setupVoiceInput(
  language: SupportedLanguage,
  options: {
    onResult?: (text: string) => void;
    onError?: (error: any) => void;
    continuous?: boolean;
    interimResults?: boolean;
  } = {},
): { start: () => void; stop: () => void; supported: boolean } | null {
  if (
    !("webkitSpeechRecognition" in window) &&
    !("SpeechRecognition" in window)
  ) {
    return { start: () => {}, stop: () => {}, supported: false };
  }

  const SR: any =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  const recognition = new SR();

  const voiceLanguages = VOICE_INPUT_LANGUAGES[language];
  recognition.lang = voiceLanguages[0]; // Use primary voice language
  recognition.continuous = options.continuous || false;
  recognition.interimResults = options.interimResults || false;

  recognition.onresult = (event: any) => {
    const result = event.results[event.results.length - 1];
    if (result.isFinal && options.onResult) {
      options.onResult(result[0].transcript);
    }
  };

  recognition.onerror = (event: any) => {
    if (options.onError) {
      options.onError(event);
    }
  };

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
    supported: true,
  };
}

/**
 * Enhanced focus management for RTL languages
 */
export function manageFocusForDirection(
  language: SupportedLanguage,
  container: HTMLElement,
): void {
  const isRTL = isRTLLanguage(language);

  if (isRTL) {
    // For RTL languages, adjust tab order and arrow key navigation
    container.setAttribute("dir", "rtl");

    // Handle arrow key navigation in RTL context
    container.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const focusableElements = container.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        const currentIndex = Array.from(focusableElements).indexOf(
          event.target as HTMLElement,
        );

        if (currentIndex !== -1) {
          let nextIndex: number;

          if (event.key === "ArrowLeft") {
            // In RTL, left arrow should go to next element
            nextIndex = isRTL ? currentIndex + 1 : currentIndex - 1;
          } else {
            // In RTL, right arrow should go to previous element
            nextIndex = isRTL ? currentIndex - 1 : currentIndex + 1;
          }

          nextIndex = Math.max(
            0,
            Math.min(focusableElements.length - 1, nextIndex),
          );

          if (nextIndex !== currentIndex) {
            event.preventDefault();
            (focusableElements[nextIndex] as HTMLElement).focus();
          }
        }
      }
    });
  } else {
    container.setAttribute("dir", "ltr");
  }
}

// Extend Window interface for speech recognition
// Avoid relying on DOM lib specific SpeechRecognition types in strict TS environments
