import type { GTagFunction } from "./gtag-function";

declare global {
  interface Window {
    gtag: GTagFunction;
  }
}
