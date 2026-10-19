import type { UseQueryResult } from '@tanstack/react-query';
import type { NarrativesTableStatus, SortKey, SortState } from '@/components/NarrativesTable';
import type { NarrativeSortField, NarrativesQuery } from '@/interfaces/narrative-api.interface';

const SORT_FIELDS: Record<SortKey, NarrativeSortField> = {
  location: 'locationName',
  detectedAt: 'detectedAt',
  viewsCount: 'viewsCount',
};

export const toSortParams = (
  sort: SortState | null,
): Pick<NarrativesQuery, 'sortBy' | 'sortDir'> => {
  return sort ? { sortBy: SORT_FIELDS[sort.key], sortDir: sort.direction } : {};
};

export const toTableStatus = ({
  data,
  isError,
  isFetching,
}: Pick<UseQueryResult, 'data' | 'isError' | 'isFetching'>): NarrativesTableStatus => {
  if (data) {
    return 'ready';
  }

  return isError && !isFetching ? 'error' : 'loading';
};
