import { EventStatus, Severity } from '../../../entities';

export class EventResponseDto {
  eventId: string;
  narrativeId: string;
  title: string;
  summary: string;
  arena: string[];
  createdAt: Date;
  createdBy: string;
  detectedAt: Date;
  closedAt: Date | null;
  closedBy: string | null;
  closedSummary: string | null;
  severity: Severity;
  status: EventStatus;
  isSimulation: boolean;
  simulationId: string | null;
  actions: Array<{
    actionId: string;
    title: string;
    description: string | null;
    actionTypeCode: string;
    performedBy: string;
    performedAt: Date;
    actionType?: {
      code: string;
      labelHe: string;
      active: boolean;
    };
  }>;
}
