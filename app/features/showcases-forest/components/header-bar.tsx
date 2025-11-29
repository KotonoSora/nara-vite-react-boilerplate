import { Flame, Leaf } from "lucide-react";

export function HeaderBar() {
  return (
    <section className="h-[30px] mt-2 w-full relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base leading-none">
        <Flame fill="#ffffff" strokeWidth={0} />
      </div>
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-base leading-none flex flex-row justify-end items-center gap-2">
        <Leaf stroke="#ffffff" />
        <span className="text-sm leading-none text-white"></span>
      </div>
    </section>
  );
}
