import { formatArenas } from '@/constants/arena.constant';
import type { Narrative } from '@/interfaces/narrative.interface';
import type { SortKey, SortState } from '../interfaces/sort.interface';

type Comparator = (a: Narrative, b: Narrative) => number;

const collator = new Intl.Collator('he', { numeric: true, sensitivity: 'base' });

const comparators: Record<SortKey, Comparator> = {
  viewsCount: (a, b) => a.viewsCount - b.viewsCount,
  detectedAt: (a, b) => Date.parse(a.detectedAt) - Date.parse(b.detectedAt),
  arena: (a, b) => collator.compare(formatArenas(a.arena), formatArenas(b.arena)),
};

export const nextSort = (current: SortState | null, key: SortKey): SortState => {
  if (current?.key === key) {
    return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
  }
  return { key, direction: 'asc' };
};

const byFlag: Comparator = (a, b) => Number(b.isFlagged) - Number(a.isFlagged);

export const sortNarratives = (
  narratives: readonly Narrative[],
  sort: SortState | null,
): readonly Narrative[] => {
  if (!sort) return narratives.toSorted(byFlag);

  const compare = comparators[sort.key];
  const factor = sort.direction === 'asc' ? 1 : -1;

  return narratives.toSorted((a, b) => {
    const flagged = byFlag(a, b);
    if (flagged !== 0) return flagged;

    // Narratives with no arena stay last in both directions.
    if (sort.key === 'arena') {
      const missing = Number(a.arena.length === 0) - Number(b.arena.length === 0);
      if (missing !== 0) return missing;
    }
    return factor * compare(a, b);
  });
};
