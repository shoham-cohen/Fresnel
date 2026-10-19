import type { SortKey } from '../interfaces/sort.interface';

export const COLUMN_COUNT = 6;
export const VIEWS_COUNT_MAX = 1_000_000;

interface SortableColumn {
  key: SortKey;
  label: string;
  tooltip?: string;
}

export const SORTABLE_COLUMNS: readonly SortableColumn[] = [
  { key: 'arena', label: 'מיקום' },
  { key: 'detectedAt', label: 'תאריך ושעה' },
  {
    key: 'viewsCount',
    label: 'היקף תנועה',
    tooltip: 'כמה פעמים נצפתה ההתראה. הפס מתמלא ביחס למיליון צפיות.',
  },
];
