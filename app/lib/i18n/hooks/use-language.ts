import { useI18n } from "./use-i18n";

export function useLanguage() {
  const { language, setLanguage } = useI18n();
  return { language, setLanguage };
}
