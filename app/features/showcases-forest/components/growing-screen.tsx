import type { GrowingScreenProps } from "../types/common";

import { Button } from "~/components/ui/button";

import { STATUS } from "../constants/common";
import { FocusTagButton } from "./focus-tag-button";
import { TimerDisplay } from "./timer-display";
import { TreeStatusProgress } from "./tree-status-progress";

export function GrowingScreen({
  label,
  slogan,
  progress,
  onGiveUp,
  tagColor,
  tagLabel,
  onTagColorChange,
  onTagLabelChange,
}: GrowingScreenProps) {
  return (
    <section className="flex flex-col flex-1 items-center justify-between gap-4 py-4">
      <div className="text-sm leading-none text-white font-light tracking-normal text-center w-full px-4">
        {slogan}
      </div>

      <TreeStatusProgress status={STATUS.GROWING} progress={progress} />

      <div className="flex flex-col items-center justify-center gap-6">
        <FocusTagButton
          label={tagLabel}
          color={tagColor}
          onLabelChange={onTagLabelChange}
          onColorChange={onTagColorChange}
        />

        <TimerDisplay label={label} />

        <Button
          variant="outline"
          size="sm"
          className="h-8 bg-transparent text-white hover:bg-muted/10 hover:text-white cursor-pointer text-xs"
          onClick={onGiveUp}
        >
          Give Up
        </Button>
      </div>
    </section>
  );
}
