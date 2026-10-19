export type SortDir = 'asc' | 'desc';
export type Arena = 'IL' | 'ARAB' | 'INTL';
export type NarrativeSortField = 'locationName' | 'detectedAt' | 'viewsCount';

export interface NarrativeDto {
  title: string;
  isAnomaly: boolean;
  arena: Arena | null;
  receivedAt: string;
  detectedAt: string;
  viewsCount: number;
  isFlagged: boolean;
  narrativeId: string;
  summary: string | null;
  locationName: string | null;
  payload: Record<string, unknown>;
}

export type NarrativeUpdate = Partial<Omit<NarrativeDto, 'narrativeId'>>;

export interface NarrativesQuery {
  to?: string;
  from?: string;
  page?: number;
  search?: string;
  sortDir?: SortDir;
  pageSize?: number;
  locationName?: string;
  sortBy?: NarrativeSortField;
}

export interface Page<T> {
  items: T[];
  page: number;
  total: number;
  pageSize: number;
}
