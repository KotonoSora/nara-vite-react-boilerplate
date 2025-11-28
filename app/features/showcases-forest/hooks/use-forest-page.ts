import { useEffect, useReducer, useRef, useState } from "react";

import type { ForestAction, ForestState } from "../types/common";

import { FOREST_ACTIONS, STATUS, TAG_COLORS } from "../constants/common";
import { calculateProgress } from "../utils/calculate-progress";
import { clearTimerInterval } from "../utils/clear-timer-interval";
import { createAbandonTreeState } from "../utils/create-abandon-tree-state";
import { createFullyGrownState } from "../utils/create-fully-grown-state";
import { createGrowingState } from "../utils/create-growing-state";
import { createPlantingState } from "../utils/create-planting-state";
import { formatSecondsToMinutesSeconds } from "../utils/format-seconds-to-minutes-seconds";
import { updateTimerPreviewState } from "../utils/update-timer-preview-state";

function reducer(state: ForestState, action: ForestAction): ForestState {
  switch (action.type) {
    case FOREST_ACTIONS.START_GROWING:
      return Object.assign(
        {},
        state,
        createGrowingState(action.payload.minutes),
      );
    case FOREST_ACTIONS.ABANDON:
      return Object.assign({}, state, createAbandonTreeState(state));
    case FOREST_ACTIONS.RESET:
      return Object.assign({}, state, createPlantingState());
    case FOREST_ACTIONS.UPDATE_PREVIEW:
      return updateTimerPreviewState(state, action.payload.minutes);
    case FOREST_ACTIONS.TICK:
      return { ...state, seconds: action.payload.remainingSeconds };
    case FOREST_ACTIONS.COMPLETE:
      return createFullyGrownState(state);
    default:
      return state;
  }
}

export function useForestPage() {
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const [state, dispatch] = useReducer(reducer, createPlantingState());
  const [tagColor, setTagColor] = useState(TAG_COLORS[0]);
  const [tagLabel, setTagLabel] = useState("Work");

  const timerLabel = formatSecondsToMinutesSeconds(state.seconds);
  const progress = calculateProgress(state.initialSeconds, state.seconds);

  const abandonTree = () => {
    clearTimerInterval(intervalRef);
    startTimeRef.current = null;
    dispatch({ type: FOREST_ACTIONS.ABANDON, payload: undefined });
  };

  const startGrowing = () => {
    const minutes = state.initialSeconds / 60;
    startTimeRef.current = Date.now();
    dispatch({ type: FOREST_ACTIONS.START_GROWING, payload: { minutes } });
  };

  const updateTimerPreview = (minutes: number) => {
    dispatch({ type: FOREST_ACTIONS.UPDATE_PREVIEW, payload: { minutes } });
  };

  const resetToPlanting = () => {
    clearTimerInterval(intervalRef);
    startTimeRef.current = null;
    dispatch({ type: FOREST_ACTIONS.RESET, payload: undefined });
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

      if (remainingSeconds <= 0) {
        clearTimerInterval(intervalRef);
        startTimeRef.current = null;
        dispatch({ type: FOREST_ACTIONS.COMPLETE, payload: undefined });
      } else {
        dispatch({ type: FOREST_ACTIONS.TICK, payload: { remainingSeconds } });
      }
    };

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
    timerLabel,
    progress,
    abandonTree,
    startGrowing,
    updateTimerPreview,
    resetToPlanting,
    tagColor,
    setTagColor,
    tagLabel,
    setTagLabel,
  };
}
