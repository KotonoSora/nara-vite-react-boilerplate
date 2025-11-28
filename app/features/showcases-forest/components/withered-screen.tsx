import { Button } from "~/components/ui/button";

import { STATUS } from "../constants/common";
import { useForestContext } from "../context/forest-context";
import { FocusTagButton } from "./focus-tag-button";
import { TimerDisplay } from "./timer-display";
import { TreeStatusProgress } from "./tree-status-progress";

export function WitheredScreen() {
  const { state, timerLabel, resetToPlanting } = useForestContext();
  return (
    <section className="flex flex-col flex-1 items-center justify-between gap-4 py-4">
      <div className="text-sm leading-none text-white font-light tracking-normal text-center w-full px-4">
        {state.slogan}
      </div>

      <TreeStatusProgress status={STATUS.WITHERED} />

      <div className="flex flex-col items-center justify-center gap-6">
        <FocusTagButton />

        <TimerDisplay label={timerLabel} />

        <Button
          size="sm"
          className="h-8 cursor-pointer bg-white/20 hover:bg-white/25 border-b-3 border-zinc-800/40"
          onClick={resetToPlanting}
        >
          Take a break
        </Button>
      </div>
    </section>
  );
}
