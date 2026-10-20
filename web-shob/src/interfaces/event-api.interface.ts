export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface CreateEventDto {
  narrativeId: string;
  severity: Severity;
  createdBy: string;
  simulationId?: string; 
}