import type { STATUS } from "../constants/common";

import { FOREST_ACTIONS } from "../constants/common";

export type Status = (typeof STATUS)[keyof typeof STATUS];

export type ForestAction =
  | { type: typeof FOREST_ACTIONS.START_GROWING; payload: { minutes: number } }
  | { type: typeof FOREST_ACTIONS.ABANDON; payload: undefined }
  | { type: typeof FOREST_ACTIONS.RESET; payload: undefined }
  | { type: typeof FOREST_ACTIONS.UPDATE_PREVIEW; payload: { minutes: number } }
  | { type: typeof FOREST_ACTIONS.TICK; payload: { remainingSeconds: number } }
  | { type: typeof FOREST_ACTIONS.COMPLETE; payload: undefined };

export type ForestState = {
  status: Status;
  seconds: number;
  initialSeconds: number;
  slogan: string;
};

export type FullyGrownScreenProps = {
  slogan: string;
  label: string;
  onReset: () => void;
  tagColor: string;
  tagLabel: string;
  onTagColorChange: (color: string) => void;
  onTagLabelChange: (label: string) => void;
};

export type GrowingScreenProps = {
  label: string;
  slogan: string;
  progress: number;
  onGiveUp: () => void;
  tagColor: string;
  tagLabel: string;
  onTagColorChange: (color: string) => void;
  onTagLabelChange: (label: string) => void;
};

export type PlantingScreenProps = {
  timerLabel: string;
  onTimerChange: (value: number) => void;
  onPlant: () => void;
  tagColor: string;
  tagLabel: string;
  onTagColorChange: (color: string) => void;
  onTagLabelChange: (label: string) => void;
  defaultMinutes: number;
};

export type TimerDisplayProps = { label: string };

export type WitheredScreenProps = {
  slogan: string;
  label: string;
  onReset: () => void;
  tagColor: string;
  tagLabel: string;
  onTagColorChange: (color: string) => void;
  onTagLabelChange: (label: string) => void;
};

export type TreeStatusProgressProps = {
  status: Status;
  progress?: number;
};

export type FocusTagButtonProps = {
  label: string;
  color: string;
  onLabelChange: (label: string) => void;
  onColorChange: (color: string) => void;
};
