export const add = (a: number, b: number) => {
  return a + b;
};

export const capitalize = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const multiply = (a: number, b: number) => {
  return a * b;
};
