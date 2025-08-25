export function getDaysSinceJoined(createdAt: string | Date) {
  return Math.floor(
    (new Date().getTime() - new Date(createdAt).getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

export function getStats(createdAt: string | Date) {
  const daysSinceJoined = getDaysSinceJoined(createdAt);

  return {
    daysActive: daysSinceJoined,
    totalLogins: Math.floor(Math.random() * 50) + 10, // Mock data
    profileViews: Math.floor(Math.random() * 100) + 25, // Mock data
  };
}
