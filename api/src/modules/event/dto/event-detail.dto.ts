export class EventDetailDto {
  eventId: string;
  title: string;
  description: string | null;
  arena: string | null;
  detectedAt: Date;
  openedBy: string;
  closedBy: string | null;
  status: string;
  severity: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  closureSummary: string | null;
}
