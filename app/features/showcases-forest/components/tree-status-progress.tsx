import { FlameKindling, Shrub, Sprout, TreePine, Trees } from "lucide-react";

import type { TreeStatusProgressProps } from "../types/common";

import { cn } from "~/lib/utils";

import { STATUS } from "../constants/common";

export function TreeStatusProgress({
  status,
  progress = 0,
}: TreeStatusProgressProps) {
  const getIcon = () => {
    if (status === STATUS.PLANTING || status === STATUS.FULLY_GROWN) {
      return <Trees className="size-12 stroke-(--color-forest-primary)" />;
    }

    if (status === STATUS.WITHERED) {
      return (
        <FlameKindling className="size-12 stroke-(--color-forest-primary)" />
      );
    }

    // Growing status - icon based on progress
    if (progress <= 25) {
      return <Sprout className="size-12 stroke-(--color-forest-primary)" />;
    }
    if (progress <= 50) {
      return <Shrub className="size-12 stroke-(--color-forest-primary)" />;
    }
    if (progress <= 75) {
      return <TreePine className="size-12 stroke-(--color-forest-primary)" />;
    }
    return <Trees className="size-12 stroke-(--color-forest-primary)" />;
  };

  return (
    <div
      id="tree-status-progress"
      className={cn(
        "w-[150px] h-[150px] rounded-full flex flex-col items-center justify-center relative overflow-hidden",
        "bg-(--color-forest-secondary)",
      )}
    >
      <div className="text-base leading-none text-center z-10 relative">
        {getIcon()}
      </div>
    </div>
  );
}
