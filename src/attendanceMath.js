/** @param {number} attended @param {number} held */
export function attendancePercent(attended, held) {
  if (held <= 0) return 0;
  return Math.round((attended / held) * 100);
}

/** Maximum future sessions that may be missed if every other future session is attended.
 * @param {number} attended @param {number} held @param {number} futureSessions @param {number} thresholdPercent
 */
export function futureAbsencesAllowed(attended, held, futureSessions, thresholdPercent) {
  if (futureSessions <= 0) return 0;
  const threshold = Math.min(100, Math.max(0, thresholdPercent)) / 100;
  return Math.max(0, Math.floor(attended + futureSessions - threshold * (held + futureSessions) + 1e-9));
}

/** Whether the target is still mathematically reachable by attending every remaining session.
 * @param {number} attended
 * @param {number} held
 * @param {number} futureSessions
 * @param {number} thresholdPercent
 */
export function canMeetThreshold(attended, held, futureSessions, thresholdPercent) {
  const threshold = Math.min(100, Math.max(0, thresholdPercent)) / 100;
  if (futureSessions <= 0) return held > 0 && attended / held >= threshold;
  return attended + futureSessions + 1e-9 >= threshold * (held + futureSessions);
}
