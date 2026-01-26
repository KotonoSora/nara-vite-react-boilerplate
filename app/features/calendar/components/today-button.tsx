import { Button } from "@kotonosora/ui/components/ui/button";
import { cn } from "@kotonosora/ui/lib/utils";

import type { TodayButtonProps } from "../types/type";

export function TodayButton({ onClick, className }: TodayButtonProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onClick}>Today</Button>
    </div>
  );
}
