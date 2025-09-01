import { ModeSelect } from "./mode-select";
import { WeeksSelect } from "./weeks-select";

export function Controls() {
  return (
    <div className="flex flex-row gap-2">
      <ModeSelect />
      <WeeksSelect />
    </div>
  );
}
