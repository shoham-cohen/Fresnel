export type SortDirection = 'asc' | 'desc';
export type SortKey = 'arena' | 'detectedAt' | 'viewsCount';

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}
