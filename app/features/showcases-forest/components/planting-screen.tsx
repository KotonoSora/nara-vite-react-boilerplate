import type { PlantingScreenProps } from "../types/common";

import { Button } from "~/components/ui/button";

import { RANGE_MAX, RANGE_MIN } from "../constants/common";
import { FocusTagButton } from "./focus-tag-button";
import { TimerDisplay } from "./timer-display";
import { TreeStatusProgress } from "./tree-status-progress";

export function PlantingScreen({
  timerLabel,
  inputRef,
  onTimerChange,
  onPlant,
}: PlantingScreenProps) {
  return (
    <section className="flex flex-col flex-1 items-center justify-between gap-4 py-4">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="text-sm leading-none text-white font-light tracking-normal text-center w-full px-4">
          Choose how long you'd like to focus. A tree will grow while you stay
          focused!
        </div>
      </div>

      <TreeStatusProgress status="planting" />

      <div className="flex flex-col items-center justify-center gap-6">
        <div className="w-[300px] bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <input
            type="range"
            min={RANGE_MIN}
            max={RANGE_MAX}
            step={1}
            defaultValue={RANGE_MIN}
            ref={inputRef}
            className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
              [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg 
              [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-transform 
              [&::-moz-range-thumb]:hover:scale-110"
            onChange={onTimerChange}
          />
        </div>

        <FocusTagButton />

        <TimerDisplay label={timerLabel} />

        <Button
          size="sm"
          className="h-8 cursor-pointer bg-white/20 hover:bg-white/25 border-b-3 border-zinc-800/40"
          onClick={onPlant}
        >
          Plant
        </Button>
      </div>
    </section>
  );
}
