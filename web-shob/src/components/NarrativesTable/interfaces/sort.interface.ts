export type SortDirection = 'asc' | 'desc';
export type SortKey = 'location' | 'detectedAt' | 'viewsCount';

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}
