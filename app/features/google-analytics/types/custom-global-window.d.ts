import type { GTagFunction } from "./gtag-function";

export declare global {
  interface Window {
    gtag: GTagFunction;
  }
}
