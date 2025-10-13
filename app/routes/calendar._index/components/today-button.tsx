"use client";

import type { TodayButtonProps } from "../types/type";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function TodayButton({ onClick, className }: TodayButtonProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onClick}>Today</Button>
    </div>
  );
}
