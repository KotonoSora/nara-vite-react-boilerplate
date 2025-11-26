import type { WitheredScreenProps } from "../types/common";

import { Button } from "~/components/ui/button";

export function WitheredScreen({ onReset }: WitheredScreenProps) {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center gap-6">
      <div className="text-2xl font-light text-white text-center px-4">
        💀 Your tree has withered...
      </div>
      <div className="text-sm leading-none text-white/80 font-light tracking-normal text-center w-full px-4">
        Don't give up! Try planting another tree.
      </div>
      <div className="w-[200px] h-[200px] rounded-full bg-gray-400/40 flex flex-col items-center justify-center">
        <div className="text-6xl opacity-50">🥀</div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="bg-transparent text-white hover:bg-muted/10 hover:text-white"
        onClick={onReset}
      >
        Try Again
      </Button>
    </section>
  );
}
