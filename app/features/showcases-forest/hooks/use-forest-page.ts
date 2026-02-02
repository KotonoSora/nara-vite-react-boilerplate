import { trackCustomEvents } from "@kotonosora/google-analytics";
import { formatSecondsToMinutesSeconds } from "@kotonosora/i18n";
import { useLanguage, useTranslation } from "@kotonosora/i18n-react";
import { useEffect, useReducer, useRef, useState } from "react";

import type { ForestAction, ForestState } from "../types/common";

import {
  FOREST_ACTIONS,
  LIMIT_LABEL_TAGS_CHARACTERS,
  STATUS,
  TAG_COLORS,
} from "../constants/common";
import { calculateProgress } from "../utils/calculate-progress";
import { clearTimerInterval } from "../utils/clear-timer-interval";
import { createAbandonTreeState } from "../utils/create-abandon-tree-state";
import { createFullyGrownState } from "../utils/create-fully-grown-state";
import { createGrowingState } from "../utils/create-growing-state";
import { createPlantingState } from "../utils/create-planting-state";
import { updateTimerPreviewState } from "../utils/update-timer-preview-state";

function reducer(state: ForestState, action: ForestAction): ForestState {
  const { payload, type } = action;
  const t = useTranslation();
  const GROWING_SLOGANS: string[] = [
    t("forest.screens.growing.slogans.growing_1"),
    t("forest.screens.growing.slogans.growing_2"),
    t("forest.screens.growing.slogans.growing_3"),
    t("forest.screens.growing.slogans.growing_4"),
    t("forest.screens.growing.slogans.growing_5"),
  ];

  switch (type) {
    case FOREST_ACTIONS.START_GROWING: {
      return Object.assign(
        {},
        state,
        createGrowingState({
          minutes: payload.minutes,
          slogans: GROWING_SLOGANS,
        }),
      );
    }
    case FOREST_ACTIONS.ABANDON: {
      return Object.assign(
        {},
        state,
        createAbandonTreeState(state, t("forest.screens.withered.slogan")),
      );
    }
    case FOREST_ACTIONS.RESET: {
      return Object.assign(
        {},
        state,
        createPlantingState({
          slogan: t("forest.screens.planting.slogan"),
        }),
      );
    }
    case FOREST_ACTIONS.UPDATE_PREVIEW: {
      return Object.assign(
        {},
        state,
        updateTimerPreviewState({ minutes: payload.minutes }),
      );
    }
    case FOREST_ACTIONS.TICK: {
      return Object.assign({}, state, {
        seconds: payload.remainingSeconds,
      });
    }
    case FOREST_ACTIONS.COMPLETE: {
      return Object.assign(
        {},
        state,
        createFullyGrownState({
          seconds: state.initialSeconds,
          slogan: t("forest.screens.full_grown.slogan"),
        }),
      );
    }
    default:
      return state;
  }
}

export function useForestPage() {
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const t = useTranslation();
  const { language } = useLanguage();

  const [state, dispatch] = useReducer(
    reducer,
    Object.assign(
      {},
      createPlantingState({
        slogan: t("forest.screens.planting.slogan"),
      }),
      {},
    ),
  );
  const [tagColor, setTagColor] = useState(TAG_COLORS[0]);
  const [tagLabel, setTagLabel] = useState(t("forest.common.work"));

  /**
   * Sets the tag label, limiting it to a maximum of 60 characters.
   * @param label The new tag label string.
   */
  const handleChangeTagLabel = (label: string) => {
    setTagLabel(
      label.length > LIMIT_LABEL_TAGS_CHARACTERS
        ? label.slice(0, LIMIT_LABEL_TAGS_CHARACTERS)
        : label,
    );
  };

  const timerLabel = formatSecondsToMinutesSeconds({
    seconds: state.seconds,
    language,
  });
  const progress = calculateProgress(state.initialSeconds, state.seconds);

  const abandonTree = () => {
    clearTimerInterval(intervalRef);
    startTimeRef.current = null;
    dispatch({ type: FOREST_ACTIONS.ABANDON, payload: undefined });
  };

  /**
   * Starts the growing process and logs a Google Analytics event for planting.
   * Logs the time (minutes) and tag label name.
   */
  const startGrowing = () => {
    const minutes = state.initialSeconds / 60;
    startTimeRef.current = Date.now();
    // Log Google Analytics event for planting
    trackCustomEvents({
      isProd: import.meta.env.PROD,
      trackingId: import.meta.env.VITE_GOOGLE_ANALYTIC_TRACKING_ID,
      event: {
        event_category: "Button",
        event_action: "forest_plant_tree",
        event_label: `Forest | ${tagLabel} | ${minutes}m`,
        event_value: `tag: ${tagLabel} | minutes: ${minutes} | color: ${tagColor}`,
      },
    });
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
    onLabelChange: handleChangeTagLabel,
  };
}
