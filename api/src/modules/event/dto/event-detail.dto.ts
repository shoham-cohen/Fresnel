import { EventStatus, Severity } from '../../../entities';

export interface EventDetailDto {
  eventId: string;
  narrativeId: string;
  title: string;
  summary: string | null;
  arena: string[];
  detectedAt: Date;
  isAnomaly: boolean;
  severity: Severity;
  status: EventStatus;
  isSimulation: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  closedBy: string | null;
  closureSummary: string | null;
}

