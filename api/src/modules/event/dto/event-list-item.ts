import { EventStatus, Severity } from '../../../entities';

// One row in the active / closed events lists.
export interface EventListItem {
  eventId: string;
  title: string; // the narrative title
  status: EventStatus;
  severity: Severity;
  createdAt: Date;
}

export interface EventListPage {
  items: EventListItem[];
  total: number; // all matching events, across pages
  page: number;
  pageSize: number;
}
