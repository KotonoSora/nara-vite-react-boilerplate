import { cn } from "@kotonosora/ui/lib/utils";

import { STATUS } from "../constants/common";
import { useForestContext } from "../context/forest-context";
import { BottomBar } from "./bottom-bar";
import { FullyGrownScreen } from "./fully-grown-screen";
import { GrowingScreen } from "./growing-screen";
import { HeaderBar } from "./header-bar";
import { PlantingScreen } from "./planting-screen";
import { WitheredScreen } from "./withered-screen";

export function PageContent() {
  const { state } = useForestContext();
  return (
    <main
      className={cn(
        "h-svh w-full content-visibility-auto flex flex-col flex-1 items-stretch justify-between",
        "bg-(--color-forest-primary)",
      )}
    >
      <HeaderBar />
      {state.status === STATUS.PLANTING && <PlantingScreen />}
      {state.status === STATUS.GROWING && <GrowingScreen />}
      {state.status === STATUS.FULLY_GROWN && <FullyGrownScreen />}
      {state.status === STATUS.WITHERED && <WitheredScreen />}
      <BottomBar />
    </main>
  );
}
