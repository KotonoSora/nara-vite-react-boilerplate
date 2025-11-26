import { SLOGANS } from "../constants/common";

/**
 * Returns random slogan from predefined list
 * @returns Random slogan string
 */
export function getRandomSlogan(): string {
  const index = Math.floor(Math.random() * SLOGANS.length);
  return SLOGANS[index];
}
