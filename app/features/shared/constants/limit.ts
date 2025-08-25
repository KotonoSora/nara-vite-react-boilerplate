// Limit registration: e.g., max 10 users allowed
export const MAX_USERS: number | null = process.env.MAX_USERS
  ? parseInt(process.env.MAX_USERS, 10)
  : null;
