export type Arena = 'IL' | 'ARAB' | 'INTL';

export type TimelineAction = {
  actionId: string;
  actionType: string;
  actionTypeLabel: string;
  title: string;
  description: string | null;
  performedBy: string;
};

export type ActionType = {
  code: string;
  labelHe: string;
  active: boolean;
};

export type CreateActionBody = {
  actionType: string;
  title: string;
  description: string;
};

export type CloseEventBody = {
  closureSummary: string;
  closedBy: string;
};

export type TimelineEntry = {
  kind: 'action' | 'event_created' | 'event_reopened';
  at: string;
  actorId: string;
  action: TimelineAction | null;
};
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type EventStatus = 'open' | 'in_progress' | 'closed';

export type EventDetail = {
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
};

export type TopSource = {
  platform: string;
  count: number;
};

export type Stats = {
  posts: number;
  views: number | null;
  shares: number | null;
  comments: number | null;
  topSources: TopSource[];
  basedOn: number;
  asOf: string;
};
