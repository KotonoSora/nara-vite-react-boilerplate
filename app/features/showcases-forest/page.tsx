import { FullyGrownScreen } from "./components/fully-grown-screen";
import { GrowingScreen } from "./components/growing-screen";
import { PlantingScreen } from "./components/planting-screen";
import { WitheredScreen } from "./components/withered-screen";
import { RANGE_MAX, RANGE_MIN, STATUS } from "./constants/common";
import { useForestPage } from "./hooks/use-forest-page";

export function ForestPage() {
  const {
    state,
    inputRef,
    timerLabel,
    progress,
    abandonTree,
    startGrowing,
    updateTimerPreview,
    resetToPlanting,
  } = useForestPage();

  return (
    <main className="min-h-svh h-svh w-full content-visibility-auto bg-[#4faa8c] ">
      {state.status === STATUS.PLANTING && (
        <PlantingScreen
          timerLabel={timerLabel}
          rangeMin={RANGE_MIN}
          rangeMax={RANGE_MAX}
          inputRef={inputRef}
          onTimerChange={updateTimerPreview}
          onPlant={startGrowing}
        />
      )}
      {state.status === STATUS.GROWING && (
        <GrowingScreen
          label={timerLabel}
          slogan={state.slogan}
          progress={progress}
          onGiveUp={abandonTree}
        />
      )}
      {state.status === STATUS.FULLY_GROWN && (
        <FullyGrownScreen slogan={state.slogan} onReset={resetToPlanting} />
      )}
      {state.status === STATUS.WITHERED && (
        <WitheredScreen onReset={resetToPlanting} />
      )}
    </main>
  );
}
