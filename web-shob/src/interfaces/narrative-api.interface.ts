import type { Narrative } from '@/interfaces/narrative.interface';

export type SortDir = 'asc' | 'desc';
export type Arena = 'israel' | 'arab' | 'intl';
export type NarrativeSortField = 'arena' | 'detectedAt' | 'viewsCount';

// GET /api/narratives, as the server sends it (api/src/modules/narrative/dto/narrative-response-dto.ts).
// The newer columns are nullable in the DB (rows from before the migration have them empty).
export interface NarrativeDto {
  title: string;
  // Usually Arena codes; rows from before the migration may hold the old IL / ARAB / INTL.
  arena: string[] | null;
  isEvent: boolean;
  isAnomaly: boolean;
  isFlagged: boolean;
  itemList: string[] | null;
  platforms: string[] | null;
  languages: string[] | null;
  detectedAt: string;
  narrativeId: string;
  summary: string | null;
  receivedAt: string | null;
  // bigint columns: Postgres sends them as strings.
  viewsCount: number | string | null;
  sharesCount: number | string | null;
}

export type NarrativeUpdate = Partial<Omit<Narrative, 'narrativeId'>>;

export interface NarrativesQuery {
  to?: string;
  from?: string;
  page?: number;
  search?: string;
  sortDir?: SortDir;
  pageSize?: number;
  arena?: Arena;
  sortBy?: NarrativeSortField;
}

export interface Page<T> {
  items: T[];
  page: number;
  total: number;
  pageSize: number;
}
