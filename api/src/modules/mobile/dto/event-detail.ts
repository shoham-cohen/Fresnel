import { EventStatus, Severity } from '../../../entities';

// GET /api/mobile/events/:id: the event card, with the narrative fields.
export interface EventDetail {
  eventId: string;
  narrativeId: string;
  title: string;
  summary: string | null;
  arena: string[];
  detectedAt: string;
  isAnomaly: boolean;
  severity: Severity;
  status: EventStatus;
  isSimulation: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  closedBy: string | null;
  closureSummary: string | null;
}
