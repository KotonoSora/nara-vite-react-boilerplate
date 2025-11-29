export const RANGE_MIN: number = 10;
export const RANGE_MAX: number = 180;

export const STATUS = {
  PLANTING: "planting",
  GROWING: "growing",
  WITHERED: "withered",
  FULLY_GROWN: "fully_grown",
} as const;

export const FOREST_ACTIONS = {
  START_GROWING: "START_GROWING",
  ABANDON: "ABANDON",
  RESET: "RESET",
  UPDATE_PREVIEW: "UPDATE_PREVIEW",
  TICK: "TICK",
  COMPLETE: "COMPLETE",
} as const;

export const TAG_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-amber-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-400",
  "bg-emerald-400",
  "bg-teal-400",
  "bg-cyan-400",
  "bg-sky-400",
  "bg-blue-400",
  "bg-indigo-400",
  "bg-violet-400",
  "bg-purple-400",
  "bg-fuchsia-400",
  "bg-pink-400",
  "bg-rose-400",
  "bg-zinc-400",
];
