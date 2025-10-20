import { useI18n } from "./use-i18n";

export function useTranslation() {
  const { t } = useI18n();
  return t;
}
