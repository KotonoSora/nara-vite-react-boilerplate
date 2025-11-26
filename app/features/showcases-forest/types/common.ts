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
  rangeMin: number;
  rangeMax: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onTimerChange: () => void;
  onPlant: () => void;
};

export type TimerDisplayProps = { label: string };

export type WitheredScreenProps = {
  onReset: () => void;
};
