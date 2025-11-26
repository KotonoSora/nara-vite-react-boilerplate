import { useEffect, useRef, useState } from "react";

import type { ForestState } from "../types/common";

import { RANGE_MAX, RANGE_MIN, STATUS } from "../constants/common";
import { calculateProgress } from "../utils/calculate-progress";
import { clearTimerInterval } from "../utils/clear-timer-interval";
import { createAbandonTreeState } from "../utils/create-abandon-tree-state";
import { createGrowingState } from "../utils/create-growing-state";
import { createPlantingState } from "../utils/create-planting-state";
import { formatSecondsToMinutesSeconds } from "../utils/format-seconds-to-minutes-seconds";
import { getInputValue } from "../utils/get-input-value";
import { tickTimerState } from "../utils/tick-timer-state";
import { updateTimerPreviewState } from "../utils/update-timer-preview-state";

export function useForestPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<number | null>(null);

  const [state, setState] = useState<ForestState>(createPlantingState());

  const timerLabel = formatSecondsToMinutesSeconds(state.seconds);
  const progress = calculateProgress(state.initialSeconds, state.seconds);

  const abandonTree = () => {
    clearTimerInterval(intervalRef);
    setState(createAbandonTreeState(state));
  };

  const startGrowing = () => {
    const value = getInputValue(inputRef);
    if (value === null) return;
    setState(createGrowingState(value));
  };

  const updateTimerPreview = () => {
    const value = getInputValue(inputRef);
    if (value === null) return;
    setState((prev) => updateTimerPreviewState(prev, value));
  };

  const resetToPlanting = () => {
    clearTimerInterval(intervalRef);
    setState(createPlantingState());
  };

  useEffect(() => {
    if (state.status !== STATUS.GROWING || state.seconds <= 0) {
      clearTimerInterval(intervalRef);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setState((prev) => {
        if (prev.seconds <= 1) {
          clearTimerInterval(intervalRef);
        }
        return tickTimerState(prev);
      });
    }, 1000);

    return () => clearTimerInterval(intervalRef);
  }, [state.status]);

  useEffect(() => {
    return () => clearTimerInterval(intervalRef);
  }, []);

  return {
    state,
    inputRef,
    timerLabel,
    progress,
    abandonTree,
    startGrowing,
    updateTimerPreview,
    resetToPlanting,
  };
}
