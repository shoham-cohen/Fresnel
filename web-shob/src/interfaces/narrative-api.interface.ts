import type { Narrative } from '@/interfaces/narrative.interface';

export type SortDir = 'asc' | 'desc';
export type Arena = 'israel' | 'arab' | 'intl';
export type NarrativeSortField = 'arena' | 'detectedAt' | 'viewsCount';

export interface NarrativeDto {
  title: string;
  arena: string[] | null;
  isEvent: boolean;
  isAnomaly: boolean;
  isFlagged: boolean;
  itemList: string[] | null;
  platforms: string[] | null;
  languages: string[] | null;
  detectedAt: string;
  narrativeId: string;
  simulationId?: string | null;
  summary: string | null;
  receivedAt: string | null;
  viewsCount: number | string | null;
  sharesCount: number | string | null;
}

export type NarrativeUpdate = Partial<Omit<Narrative, 'narrativeId' | 'rowId' | 'simulationId'>>;

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
