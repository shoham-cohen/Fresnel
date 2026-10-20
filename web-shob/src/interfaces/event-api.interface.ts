export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface CreateEventDto {
  narrativeId: string;
  severity: Severity;
  createdBy: string;
  simulationId?: string | null; 
}