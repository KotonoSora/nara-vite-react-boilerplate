import { useTranslation } from "@kotonosora/i18n-react";

import { Button } from "~/components/ui/button";

import { STATUS } from "../constants/common";
import { useForestContext } from "../context/forest-context";
import { FocusTagButton } from "./focus-tag-button";
import { SloganTitle } from "./slogan-title";
import { TimerDisplay } from "./timer-display";
import { TreeStatusProgress } from "./tree-status-progress";

export function FullyGrownScreen() {
  const t = useTranslation();
  const { timerLabel, resetToPlanting } = useForestContext();

  return (
    <section className="flex flex-col flex-1 items-center justify-between gap-4 py-4">
      <SloganTitle />

      <TreeStatusProgress status={STATUS.FULLY_GROWN} />

      <div className="flex flex-col items-center justify-center gap-6">
        <div className="h-14" />

        <FocusTagButton />

        <TimerDisplay label={timerLabel} />

        <Button
          size="sm"
          className="h-8 cursor-pointer bg-white/20 hover:bg-white/25 border-b-3 border-zinc-800/40"
          onClick={resetToPlanting}
        >
          {t("forest.actions.take_break")}
        </Button>
      </div>
    </section>
  );
}
