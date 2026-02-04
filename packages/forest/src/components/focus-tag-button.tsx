import { Button } from "@kotonosora/ui/components/ui/button";
import { Input } from "@kotonosora/ui/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@kotonosora/ui/components/ui/popover";
import { cn } from "@kotonosora/ui/lib/utils";
import { Pencil } from "lucide-react";

import { LIMIT_LABEL_TAGS_CHARACTERS, TAG_COLORS } from "../constants/common";
import { useForestContext } from "../context/forest-context";

export function FocusTagButton() {
  const {
    tagLabel: label,
    tagColor: color,
    onLabelChange,
    setTagColor: onColorChange,
  } = useForestContext();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="tag-focus-tracking"
          variant="secondary"
          size="sm"
          className="h-6 rounded-full bg-accent/20 text-white hover:bg-muted/25 hover:text-white cursor-pointer text-xs leading-none gap-2 font-light tracking-normal"
        >
          <i
            className={cn(
              "w-2 h-2 rounded-full block border border-zinc-50",
              color,
            )}
          />
          {label}
          <Pencil className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <Input
            id="label"
            defaultValue={label}
            className="col-span-2 h-8"
            onChange={(e) => onLabelChange(e.target.value)}
            maxLength={LIMIT_LABEL_TAGS_CHARACTERS}
          />
          <div className="col-span-2 flex flex-wrap gap-2">
            {TAG_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={cn(
                  "w-6 h-6 rounded-full border border-zinc-200 cursor-pointer transition-all hover:scale-110",
                  c,
                  color === c && "ring-2 ring-offset-2 ring-black scale-110",
                )}
                onClick={() => onColorChange(c)}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
