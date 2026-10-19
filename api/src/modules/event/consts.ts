export const SERVITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
} as const;

export type Severity = typeof SERVITY[keyof typeof SERVITY];