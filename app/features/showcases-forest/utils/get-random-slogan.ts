import { SLOGANS } from "../constants/common";

export function getRandomSlogan(): string {
  return SLOGANS[Math.floor(Math.random() * SLOGANS.length)];
}
