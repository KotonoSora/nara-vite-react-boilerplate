/**
 * Returns random slogan from predefined list
 * @returns Random slogan string
 */
export function getRandomSlogan(slogans: string[]): string {
  const index = Math.floor(Math.random() * slogans.length);
  return slogans[index];
}
