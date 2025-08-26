// Limit registration: e.g., max 10 users allowed
export const MAX_USERS: number | null = import.meta.env.VITE_MAX_USERS
  ? parseInt(import.meta.env.VITE_MAX_USERS, 10)
  : null;
