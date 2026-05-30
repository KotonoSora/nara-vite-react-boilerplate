// Idle callback helpers
export type IdleCallbackHandle =
  | number
  | ReturnType<typeof globalThis.setTimeout>;
export type IdleDeadline = { timeRemaining: () => number; didTimeout: boolean };
export type IdleCallback = (deadline: IdleDeadline) => void;
