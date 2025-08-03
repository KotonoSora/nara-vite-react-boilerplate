// Navigation constants
export const NAVIGATION_IDS = {
  MOBILE: "mobile-navigation",
  MAIN: "main-navigation",
  FOOTER: "footer-navigation",
} as const;

// Animation classes for consistent transitions
export const ANIMATION_CLASSES = {
  FADE_IN: "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200",
  FADE_OUT: "motion-safe:animate-out motion-safe:fade-out motion-safe:duration-200",
  SLIDE_IN_FROM_RIGHT: "motion-safe:animate-in motion-safe:slide-in-from-right motion-safe:duration-300",
  SLIDE_IN_FROM_LEFT: "motion-safe:animate-in motion-safe:slide-in-from-left motion-safe:duration-300",
  SLIDE_IN_FROM_TOP: "motion-safe:animate-in motion-safe:slide-in-from-top motion-safe:duration-300",
  SLIDE_IN_FROM_BOTTOM: "motion-safe:animate-in motion-safe:slide-in-from-bottom motion-safe:duration-300",
  SCALE_IN: "motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-200",
  BOUNCE: "motion-safe:animate-bounce",
  PULSE: "motion-safe:animate-pulse",
} as const;

// Common spacing and sizing constants
export const LAYOUT_CONSTANTS = {
  CONTAINER_MAX_WIDTH: "max-w-7xl",
  SECTION_PADDING_Y: "py-12 sm:py-16 lg:py-24",
  SECTION_PADDING_X: "px-4 sm:px-6 lg:px-8",
  HEADER_HEIGHT: "h-16",
  FOOTER_MIN_HEIGHT: "min-h-[200px]",
} as const;

// Common breakpoints for responsive design
export const BREAKPOINTS = {
  SM: "640px",
  MD: "768px",
  LG: "1024px",
  XL: "1280px",
  "2XL": "1536px",
} as const;

// Z-index scale for layering
export const Z_INDEX = {
  DROPDOWN: 50,
  MODAL: 100,
  NOTIFICATION: 150,
  TOOLTIP: 200,
} as const;