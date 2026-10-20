import {
  narrativeKeys,
  RECENT_NARRATIVES_OPTIONS,
  HISTORY_NARRATIVES_OPTIONS,
} from '@/config/react-query.config';

import type { Reality } from '@/types';
import { useReality } from './useReality';
import { useCallback, useEffect, useMemo } from 'react';
import { toTableStatus } from '@/utilities/narrative.utility';
import { narrativeService } from '@/services/narrative.service';
import type { Narrative } from '@/interfaces/narrative.interface';
import type { Page, NarrativeUpdate, NarrativesQuery } from '@/interfaces/narrative-api.interface';
import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

const MAX_BATCH_SIZE = 100;
const HOUR_MS = 60 * 60 * 1000;
const RECENT_PAGE_SIZE = MAX_BATCH_SIZE;

const toTableProps = (result: UseQueryResult<Page<Narrative>>, refetch: () => void) => {
  return {
    refetch,
    tableStatus: toTableStatus(result),
    total: result.data?.total ?? 0,
    narratives: result.data?.items ?? [],
    isRefetching: result.isRefetching,
  };
};

const toBatch = ({ page = 1, pageSize = 20, ...filters }: NarrativesQuery) => {
  const batchSize = pageSize * Math.max(1, Math.floor(MAX_BATCH_SIZE / pageSize));
  const firstRow = (page - 1) * pageSize;

  return {
    batchQuery: { ...filters, pageSize: batchSize, page: Math.floor(firstRow / batchSize) + 1 },
    offset: firstRow % batchSize,
    isLastPageOfBatch: (firstRow % batchSize) + pageSize >= batchSize,
  };
};

const fetchHistoryBatch = (reality: Reality, batchQuery: NarrativesQuery) => ({
  ...HISTORY_NARRATIVES_OPTIONS,
  queryKey: narrativeKeys.history(reality, batchQuery),
  queryFn: ({ signal }: { signal: AbortSignal }) =>
    narrativeService.getPage(reality, batchQuery, signal),
});

export const useNarratives = (query: NarrativesQuery, { enabled = true } = {}) => {
  const { reality } = useReality();
  const queryClient = useQueryClient();
  const { page = 1, pageSize = 20 } = query;
  const { batchQuery, offset, isLastPageOfBatch } = useMemo(() => toBatch(query), [query]);

  const select = useCallback(
    (batch: Page<Narrative>): Page<Narrative> => ({
      page,
      pageSize,
      total: batch.total,
      items: batch.items.slice(offset, offset + pageSize),
    }),
    [page, pageSize, offset],
  );

  const result = useQuery({ ...fetchHistoryBatch(reality, batchQuery), enabled, select });

  const total = result.data?.total ?? 0;
  const hasNextBatch = batchQuery.page * batchQuery.pageSize < total;
  useEffect(() => {
    if (enabled && isLastPageOfBatch && hasNextBatch) {
      queryClient
        .query(fetchHistoryBatch(reality, { ...batchQuery, page: batchQuery.page + 1 }))
        .catch(() => undefined);
    }
  }, [enabled, isLastPageOfBatch, hasNextBatch, queryClient, reality, batchQuery]);

  const refetch = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: narrativeKeys.histories(reality) });
  }, [queryClient, reality]);

  return toTableProps(result, refetch);
};

export const useRecentNarratives = (hours: number) => {
  const { reality } = useReality();
  const result = useQuery({
    ...RECENT_NARRATIVES_OPTIONS,
    queryKey: narrativeKeys.recent(reality, hours),
    queryFn: ({ signal }) =>
      narrativeService.getPage(
        reality,
        {
          pageSize: RECENT_PAGE_SIZE,
          from: new Date(Date.now() - hours * HOUR_MS).toISOString(),
        },
        signal,
      ),
  });

  return toTableProps(result, () => void result.refetch());
};

interface NarrativeUpdateRequest {
  narrativeId: string;
  changes: NarrativeUpdate;
}

export const useUpdateNarrative = () => {
  const queryKey = narrativeKeys.all;
  const queryClient = useQueryClient();
  const mutationKey = narrativeKeys.update();

  const { mutate } = useMutation({
    mutationKey,
    mutationFn: ({ narrativeId, changes }: NarrativeUpdateRequest) =>
      narrativeService.update(narrativeId, changes),
    onMutate: async ({ narrativeId, changes }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueriesData<Page<Narrative>>({ queryKey });

      queryClient.setQueriesData<Page<Narrative>>(
        { queryKey },
        (page) =>
          page && {
            ...page,
            items: page.items.map((narrative) =>
              narrative.narrativeId === narrativeId ? { ...narrative, ...changes } : narrative,
            ),
          },
      );

      return { previous };
    },
    onError: (_error, _request, context) => {
      context?.previous.forEach(([key, page]) => {
        queryClient.setQueryData(key, page);
      });
    },
    onSettled: async () => {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        await queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  return mutate;
};

export const useToggleNarrativeFlag = () => {
  const updateNarrative = useUpdateNarrative();

  return useCallback(
    (narrative: Narrative) => {
      updateNarrative({
        narrativeId: narrative.narrativeId,
        changes: { isFlagged: !narrative.isFlagged },
      });
    },
    [updateNarrative],
  );
};
