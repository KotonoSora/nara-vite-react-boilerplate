import { RANGE_MAX, RANGE_MIN } from "../constants/common";

export function getInputValue(
  inputRef: React.RefObject<HTMLInputElement | null>,
): number | null {
  const value = Number(inputRef.current?.value);
  if (isNaN(value) || value < RANGE_MIN || value > RANGE_MAX) return null;
  return value;
}
