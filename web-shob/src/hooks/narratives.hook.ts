import {
  narrativeKeys,
  RECENT_NARRATIVES_OPTIONS,
  HISTORY_NARRATIVES_OPTIONS,
} from '@/config/react-query.config';

import { useCallback } from 'react';
import { toTableStatus } from '@/utilities/narrative.utility';
import { narrativeService } from '@/services/narrative.service';
import type { Narrative } from '@/interfaces/narrative.interface';
import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import type { Page, NarrativeUpdate, NarrativesQuery } from '@/interfaces/narrative-api.interface';

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
      queryKey: narrativeKeys.list(query),
      queryFn: ({ signal }) => narrativeService.getAll(query, signal),
    }),
  );

export const useRecentNarratives = (hours: number) =>
  toTableProps(
    useQuery({
      ...RECENT_NARRATIVES_OPTIONS,
      queryKey: narrativeKeys.recent(hours),
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
