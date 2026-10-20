export interface TopSourceDto {
  platform: string;
  count: number;
}

export interface EventStatsDto {
  posts: number;
  views: number | null;
  shares: number | null;
  comments: number | null;
  topSources: TopSourceDto[];
  basedOn: number;
  asOf: string;
}

export interface EventInfoDto {
  eventId: string;
  narrativeId: string;
  title: string;
  summary: string | null;
  arena: string[];
  detectedAt: Date;
  updatedAt: Date;
  createdAt: Date;
  status: string;
  severity: string;
  isAnomaly: boolean;
  posts: number;
  views: number | null;
  shares: number | null;
  comments: number | null;
  topSources: TopSourceDto[];
  basedOn: number;
  asOf: string;
}

