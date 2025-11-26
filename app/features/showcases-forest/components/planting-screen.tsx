import type { PlantingScreenProps } from "../types/common";

import { Button } from "~/components/ui/button";

import { TimerDisplay } from "./timer-display";

export function PlantingScreen({
  timerLabel,
  rangeMin,
  rangeMax,
  inputRef,
  onTimerChange,
  onPlant,
}: PlantingScreenProps) {
  return (
    <>
      <section className="w-full h-48 flex flex-col items-center justify-center gap-4">
        <input
          type="range"
          min={rangeMin}
          max={rangeMax}
          step={1}
          defaultValue={rangeMin}
          ref={inputRef}
          className="border"
          onChange={onTimerChange}
        />
      </section>
      <section className="w-full h-full flex flex-col items-center justify-center">
        <TimerDisplay label={timerLabel} />
        <Button onClick={onPlant}>Plant</Button>
      </section>
    </>
  );
}
