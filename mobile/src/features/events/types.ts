export type EventStatus = 'open' | 'in_progress' | 'closed';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

// One row in GET /api/mobile/events.
export type OpenEvent = {
  eventId: string;
  title: string;
  status: EventStatus;
  severity: Severity;
  createdAt: string;
  isAnomaly: boolean;
};
