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

