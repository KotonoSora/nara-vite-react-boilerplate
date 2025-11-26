import type { RefObject } from "react";

import { RANGE_MAX, RANGE_MIN } from "../constants/common";

/**
 * Validates and extracts numeric value from input ref
 * @param inputRef - Input element reference
 * @returns Valid number within range or null
 */
export function getInputValue(
  inputRef: RefObject<HTMLInputElement | null>,
): number | null {
  const input = inputRef.current;
  if (!input?.value) return null;

  const value = Number(input.value);
  if (Number.isNaN(value) || value < RANGE_MIN || value > RANGE_MAX) {
    return null;
  }

  return value;
}
