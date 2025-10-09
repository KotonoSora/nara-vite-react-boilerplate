export function getUserInitial(userName?: string): string {
  return userName?.charAt(0).toUpperCase() ?? "";
}
