import { Pencil } from "lucide-react";

import type { FocusTagButtonProps } from "../types/common";

import { Button } from "~/components/ui/button";

export function FocusTagButton({ label = "Work" }: FocusTagButtonProps) {
  return (
    <Button
      id="tag-focus-tracking"
      variant="secondary"
      size="sm"
      className="h-6 rounded-full bg-accent/20 text-white hover:bg-muted/25 hover:text-white cursor-pointer text-xs leading-none gap-2 font-light tracking-normal"
    >
      <i className="bg-red-400 w-2 h-2 rounded-full block" />
      {label}
      <Pencil className="size-3" />
    </Button>
  );
}
