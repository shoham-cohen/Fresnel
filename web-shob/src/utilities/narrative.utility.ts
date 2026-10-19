import type { UseQueryResult } from '@tanstack/react-query';
import type { Narrative } from '@/interfaces/narrative.interface';
import type {
  NarrativeDto,
  NarrativeSortField,
  NarrativesQuery,
} from '@/interfaces/narrative-api.interface';
import type { NarrativesTableStatus, SortKey, SortState } from '@/components/NarrativesTable';

const SORT_FIELDS: Record<SortKey, NarrativeSortField> = {
  location: 'locationName',
  detectedAt: 'detectedAt',
  viewsCount: 'viewsCount',
};

export const toNarrative = (dto: NarrativeDto): Narrative => {
  return {
    title: dto.title,
    summary: dto.summary,
    detectedAt: dto.detectedAt,
    narrativeId: dto.narrativeId,
    locationName: dto.locationName,
    viewsCount: dto.viewsCount,
  };
};

/** The table's sort as API query params. */
export const toSortParams = (
  sort: SortState | null,
): Pick<NarrativesQuery, 'sortBy' | 'sortDir'> => {
  return sort ? { sortBy: SORT_FIELDS[sort.key], sortDir: sort.direction } : {};
};

/**
 * Rows on hand always win: a failed background poll keeps showing them, and the error state
 * only appears when there is nothing to show. A retry from the error shows loading again.
 */
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
