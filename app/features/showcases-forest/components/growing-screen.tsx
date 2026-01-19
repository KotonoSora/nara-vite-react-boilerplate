import { useTranslation } from "@kotonosora/i18n-react";

import { Button } from "~/components/ui/button";

import { STATUS } from "../constants/common";
import { useForestContext } from "../context/forest-context";
import { FocusTagButton } from "./focus-tag-button";
import { SloganTitle } from "./slogan-title";
import { TimerDisplay } from "./timer-display";
import { TreeStatusProgress } from "./tree-status-progress";

export function GrowingScreen() {
  const t = useTranslation();
  const { timerLabel, progress, abandonTree } = useForestContext();

  return (
    <section className="flex flex-col flex-1 items-center justify-between gap-4 py-4">
      <SloganTitle />

      <TreeStatusProgress status={STATUS.GROWING} progress={progress} />

      <div className="flex flex-col items-center justify-center gap-6">
        <div className="h-14" />

        <FocusTagButton />

        <TimerDisplay label={timerLabel} />

        <Button
          variant="outline"
          size="sm"
          className="h-8 bg-transparent text-white hover:bg-muted/10 hover:text-white cursor-pointer text-xs"
          onClick={abandonTree}
        >
          {t("forest.actions.give")}
        </Button>
      </div>
    </section>
  );
}
