import { cn } from "~/lib/utils";

import { BottomBar } from "./components/bottom-bar";
import { FullyGrownScreen } from "./components/fully-grown-screen";
import { GrowingScreen } from "./components/growing-screen";
import { HeaderBar } from "./components/header-bar";
import { PlantingScreen } from "./components/planting-screen";
import { WitheredScreen } from "./components/withered-screen";
import { STATUS } from "./constants/common";
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
    tagColor,
    setTagColor,
    tagLabel,
    setTagLabel,
  } = useForestPage();

  return (
    <main
      className={cn(
        "h-svh w-full content-visibility-auto flex flex-col flex-1 items-stretch justify-between",
        "bg-(--color-forest-primary)",
      )}
    >
      <HeaderBar />
      {state.status === STATUS.PLANTING && (
        <PlantingScreen
          timerLabel={timerLabel}
          inputRef={inputRef}
          onTimerChange={updateTimerPreview}
          onPlant={startGrowing}
          tagColor={tagColor}
          tagLabel={tagLabel}
          onTagColorChange={setTagColor}
          onTagLabelChange={setTagLabel}
        />
      )}
      {state.status === STATUS.GROWING && (
        <GrowingScreen
          label={timerLabel}
          slogan={state.slogan}
          progress={progress}
          onGiveUp={abandonTree}
          tagColor={tagColor}
          tagLabel={tagLabel}
          onTagColorChange={setTagColor}
          onTagLabelChange={setTagLabel}
        />
      )}
      {state.status === STATUS.FULLY_GROWN && (
        <FullyGrownScreen
          slogan={state.slogan}
          label={timerLabel}
          onReset={resetToPlanting}
          tagColor={tagColor}
          tagLabel={tagLabel}
          onTagColorChange={setTagColor}
          onTagLabelChange={setTagLabel}
        />
      )}
      {state.status === STATUS.WITHERED && (
        <WitheredScreen
          slogan={state.slogan}
          label={timerLabel}
          onReset={resetToPlanting}
          tagColor={tagColor}
          tagLabel={tagLabel}
          onTagColorChange={setTagColor}
          onTagLabelChange={setTagLabel}
        />
      )}
      <BottomBar />
    </main>
  );
}
