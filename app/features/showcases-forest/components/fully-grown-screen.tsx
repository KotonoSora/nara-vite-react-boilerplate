import type { FullyGrownScreenProps } from "../types/common";

import { Button } from "~/components/ui/button";

export function FullyGrownScreen({ slogan, onReset }: FullyGrownScreenProps) {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center gap-6">
      <div className="text-2xl font-light text-white text-center px-4">
        🌳 Your tree has fully grown!
      </div>
      <div className="text-sm leading-none text-white font-light tracking-normal text-center w-full px-4">
        {slogan}
      </div>
      <div className="w-[200px] h-[200px] rounded-full bg-[#f3eaa0] flex flex-col items-center justify-center">
        <div className="text-6xl">🌳</div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="bg-transparent text-white hover:bg-muted/10 hover:text-white"
        onClick={onReset}
      >
        Plant Another Tree
      </Button>
    </section>
  );
}
