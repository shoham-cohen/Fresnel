import { EventStatus, Severity } from '../../../entities';

// One row in the mobile home list.
export interface OpenEvent {
  eventId: string;
  title: string; // the narrative title
  status: EventStatus; // open or in_progress, never closed
  severity: Severity;
  createdAt: string;
  isAnomaly: boolean;
}

export interface OpenEventPage {
  items: OpenEvent[]; // newest first
  total: number; // all matching events, across pages
  page: number;
  pageSize: number;
}
