import type { STATUS } from "../constants/common";

export type Status = (typeof STATUS)[keyof typeof STATUS];

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
};

export type GrowingScreenProps = {
  label: string;
  slogan: string;
  progress: number;
  onGiveUp: () => void;
};

export type PlantingScreenProps = {
  timerLabel: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onTimerChange: () => void;
  onPlant: () => void;
};

export type TimerDisplayProps = { label: string };

export type WitheredScreenProps = {
  slogan: string;
  label: string;
  onReset: () => void;
};

export type TreeStatusProgressProps = {
  status: Status;
  progress?: number;
};

export type FocusTagButtonProps = {
  label?: string;
};
