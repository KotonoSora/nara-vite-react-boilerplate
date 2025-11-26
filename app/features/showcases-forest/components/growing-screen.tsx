import { Pencil } from "lucide-react";

import type { GrowingScreenProps } from "../types/common";

import { Button } from "~/components/ui/button";

import { TimerDisplay } from "./timer-display";

export function GrowingScreen({
  label,
  slogan,
  progress,
  onGiveUp,
}: GrowingScreenProps) {
  return (
    <>
      <section className="h-[30px] w-full relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base leading-none"></div>
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-base leading-none"></div>
      </section>

      <section className="w-full h-full  flex flex-col flex-1 items-center justify-evenly gap-4 py-4">
        <div className="text-sm leading-none text-white font-light tracking-normal text-center w-full px-4 ">
          {slogan}
        </div>

        <div className="w-[150px] h-[150px] rounded-full bg-[#f3eaa0] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="text-base leading-none text-center z-10 relative">
            {/* TODO: draw a tree here */}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6">
          <Button
            variant="secondary"
            size="sm"
            className="h-6 rounded-full bg-accent/20 text-white hover:bg-muted/25 hover:text-white cursor-pointer text-xs leading-none gap-2 font-light tracking-normal"
          >
            <i className="bg-red-400 w-2 h-2 rounded-full block" />
            Work
            <Pencil strokeWidth={0} fill="#ffffff" className="size-3" />
          </Button>

          <TimerDisplay label={label} />

          <Button
            variant="outline"
            size="sm"
            className="h-6 bg-transparent text-white hover:bg-muted/10 hover:text-white cursor-pointer text-xs"
            onClick={onGiveUp}
          >
            Give Up
          </Button>
        </div>
      </section>
    </>
  );
}
