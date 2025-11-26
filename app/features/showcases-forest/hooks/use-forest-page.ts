import { useEffect, useRef, useState } from "react";

import type { ForestState } from "../types/common";

import { STATUS } from "../constants/common";
import { calculateProgress } from "../utils/calculate-progress";
import { clearTimerInterval } from "../utils/clear-timer-interval";
import { createAbandonTreeState } from "../utils/create-abandon-tree-state";
import { createFullyGrownState } from "../utils/create-fully-grown-state";
import { createGrowingState } from "../utils/create-growing-state";
import { createPlantingState } from "../utils/create-planting-state";
import { formatSecondsToMinutesSeconds } from "../utils/format-seconds-to-minutes-seconds";
import { getInputValue } from "../utils/get-input-value";
import { updateTimerPreviewState } from "../utils/update-timer-preview-state";

export function useForestPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const [state, setState] = useState<ForestState>(createPlantingState());

  const timerLabel = formatSecondsToMinutesSeconds(state.seconds);
  const progress = calculateProgress(state.initialSeconds, state.seconds);

  const abandonTree = () => {
    clearTimerInterval(intervalRef);
    startTimeRef.current = null;
    setState(createAbandonTreeState(state));
  };

  const startGrowing = () => {
    const value = getInputValue(inputRef);
    if (value === null) return;
    startTimeRef.current = Date.now();
    setState(createGrowingState(value));
  };

  const updateTimerPreview = () => {
    const value = getInputValue(inputRef);
    if (value === null) return;
    setState((prev) => updateTimerPreviewState(prev, value));
  };

  const resetToPlanting = () => {
    clearTimerInterval(intervalRef);
    startTimeRef.current = null;
    setState(createPlantingState());
  };

  useEffect(() => {
    if (state.status !== STATUS.GROWING || state.seconds <= 0) {
      clearTimerInterval(intervalRef);
      startTimeRef.current = null;
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const tick = () => {
      if (startTimeRef.current === null) return;

      const elapsedSeconds = Math.floor(
        (Date.now() - startTimeRef.current) / 1000,
      );
      const remainingSeconds = Math.max(
        0,
        state.initialSeconds - elapsedSeconds,
      );

      setState((prev) => {
        if (remainingSeconds <= 0) {
          clearTimerInterval(intervalRef);
          startTimeRef.current = null;
          return createFullyGrownState(prev);
        }
        return { ...prev, seconds: remainingSeconds };
      });
    };

    tick();

    intervalRef.current = window.setInterval(tick, 1000);

    return () => {
      clearTimerInterval(intervalRef);
    };
  }, [state.status, state.initialSeconds]);

  useEffect(() => {
    return () => {
      clearTimerInterval(intervalRef);
      startTimeRef.current = null;
    };
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
