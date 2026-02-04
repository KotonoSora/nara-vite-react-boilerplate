import { useForestContext } from "../context/forest-context";

export function SloganTitle() {
  const {
    state: { slogan },
  } = useForestContext();
  return (
    <div className="min-h-14 text-sm text-white font-light tracking-normal text-center w-full px-4">
      {slogan}
    </div>
  );
}
