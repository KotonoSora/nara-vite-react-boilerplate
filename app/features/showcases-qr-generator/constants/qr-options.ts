export const QR_MAX_DATA_LENGTH: Record<string, number> = {
  L: 2953,
  M: 2331,
  Q: 1663,
  H: 1273,
};

export const QR_SIZE_OPTIONS = [
  { value: "128", label: "128x128" },
  { value: "256", label: "256x256" },
  { value: "512", label: "512x512" },
  { value: "1024", label: "1024x1024" },
] as const;

export const QR_ERROR_CORRECTION_OPTIONS = [
  { value: "L", label: "L (7%)" },
  { value: "M", label: "M (15%)" },
  { value: "Q", label: "Q (25%)" },
  { value: "H", label: "H (30%)" },
] as const;

export const QR_MARGIN_OPTIONS = [
  { value: "0", label: "no" },
  { value: "4", label: "yes" },
] as const;

export const DEFAULT_QR_OPTIONS = {
  size: 256,
  level: "H" as const,
  marginSize: 4,
};
