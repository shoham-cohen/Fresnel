import {
  QUERY_KEYS,
  RECENT_NARRATIVES_OPTIONS,
  HISTORY_NARRATIVES_OPTIONS,
} from '@/config/react-query.config';

import { toTableStatus } from '@/utilities/narrative.utility';
import { narrativeService } from '@/services/narrative.service';
import type { Narrative } from '@/interfaces/narrative.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { NarrativesQuery, Page } from '@/interfaces/narrative-api.interface';

const HOUR_MS = 60 * 60 * 1000;
const RECENT_PAGE_SIZE = 100;

const toTableProps = (result: UseQueryResult<Page<Narrative>>) => {
  return {
    tableStatus: toTableStatus(result),
    total: result.data?.total ?? 0,
    narratives: result.data?.items ?? [],
    // True only while refreshing rows already on screen, not on the first load.
    isRefetching: result.isRefetching,
    refetch: () => void result.refetch(),
  };
};

export const useNarratives = (query: NarrativesQuery) =>
  toTableProps(
    useQuery({
      ...HISTORY_NARRATIVES_OPTIONS,
      queryKey: [QUERY_KEYS.NARRATIVES, query],
      queryFn: ({ signal }) => narrativeService.getAll(query, signal),
    }),
  );

export const useRecentNarratives = (hours: number) =>
  toTableProps(
    useQuery({
      ...RECENT_NARRATIVES_OPTIONS,
      queryKey: [QUERY_KEYS.NARRATIVES, 'recent', hours],
      queryFn: ({ signal }) =>
        narrativeService.getAll(
          {
            pageSize: RECENT_PAGE_SIZE,
            from: new Date(Date.now() - hours * HOUR_MS).toISOString(),
          },
          signal,
        ),
    }),
  );
