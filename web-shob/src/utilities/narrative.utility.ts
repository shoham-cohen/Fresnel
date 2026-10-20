import type {
  NarrativeDto,
  NarrativesQuery,
  NarrativeSortField,
} from '@/interfaces/narrative-api.interface';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Narrative, NarrativeDetails } from '@/interfaces/narrative.interface';
import type { NarrativesTableStatus, SortKey, SortState } from '@/components/NarrativesTable';

export const toRowId = (narrativeId: string, simulationId?: string | null): string => {
  return simulationId ? `${simulationId}:${narrativeId}` : narrativeId;
};

export const toNarrative = (dto: NarrativeDto): Narrative => {
  return {
    rowId: toRowId(dto.narrativeId, dto.simulationId),
    simulationId: dto.simulationId ?? null,
    title: dto.title,
    summary: dto.summary,
    arena: dto.arena ?? [],
    isFlagged: dto.isFlagged,
    isAnomaly: dto.isAnomaly,
    detectedAt: dto.detectedAt,
    narrativeId: dto.narrativeId,
    viewsCount: Number(dto.viewsCount ?? 0),
  };
};

// Maps a narrative from the API to what the details panel shows.
export const toNarrativeDetails = (dto: NarrativeDto): NarrativeDetails => {
  return {
    title: dto.title,
    summary: dto.summary,
    arena: dto.arena ?? [],
    itemList: dto.itemList ?? [],
    platforms: dto.platforms ?? [],
    languages: dto.languages ?? [],
    isAnomaly: dto.isAnomaly,
    isFlagged: dto.isFlagged,
    detectedAt: dto.detectedAt,
    narrativeId: dto.narrativeId,
    simulationId: dto.simulationId ?? null,
    viewsCount: Number(dto.viewsCount ?? 0),
    sharesCount: Number(dto.sharesCount ?? 0),
    rowId: toRowId(dto.narrativeId, dto.simulationId),
  };
};

const SORT_FIELDS: Record<SortKey, NarrativeSortField> = {
  arena: 'arena',
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
