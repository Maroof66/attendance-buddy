export declare function attendancePercent(attended: number, held: number): number;
export declare function futureAbsencesAllowed(attended: number, held: number, futureSessions: number, thresholdPercent: number): number;
export declare function canMeetThreshold(attended: number, held: number, futureSessions: number, thresholdPercent: number): boolean;
