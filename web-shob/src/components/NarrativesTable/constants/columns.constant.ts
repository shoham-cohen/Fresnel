import type { SortKey } from '../interfaces/sort.interface';

export const COLUMN_COUNT = 5;

export const VIEWS_COUNT_MAX = 1_000_000;

export const SORTABLE_COLUMNS: readonly { key: SortKey; label: string }[] = [
  { key: 'location', label: 'מיקום' },
  { key: 'detectedAt', label: 'תאריך ושעה' },
  { key: 'viewsCount', label: 'היקף תנועה' },
];
