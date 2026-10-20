import {
  narrativeKeys,
  RECENT_REFETCH_MS,
  RECENT_NARRATIVES_OPTIONS,
  HISTORY_NARRATIVES_OPTIONS,
} from '@/config/react-query.config';

import { useCallback } from 'react';
import { useNow } from '@/hooks/now.hook';
import { toTableStatus } from '@/utilities/narrative.utility';
import { narrativeService } from '@/services/narrative.service';
import type { Narrative } from '@/interfaces/narrative.interface';
import { applyNarrativesQuery } from '@/utilities/narrative-query.utility';
import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import type { Page, NarrativeUpdate, NarrativesQuery } from '@/interfaces/narrative-api.interface';

const HOUR_MS = 60 * 60 * 1000;
const RECENT_PAGE_SIZE = 100;

/*
 * Main and history are two separate queries, each with its own requests and refresh rules
 * (react-query.config.ts). Within a screen, paging and sorting `select` from that screen's list,
 * so they need no request.
 * TODO: once the API filters, sorts and pages, send each screen's query to the server instead
 * of fetching every narrative.
 */
const fetchNarratives = ({ signal }: { signal: AbortSignal }) => narrativeService.getAll(signal);

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

export const useNarratives = (query: NarrativesQuery) => {
  const select = useCallback(
    (narratives: Narrative[]) => applyNarrativesQuery(narratives, query),
    [query],
  );

  return toTableProps(
    useQuery({
      ...HISTORY_NARRATIVES_OPTIONS,
      queryKey: narrativeKeys.history(),
      queryFn: fetchNarratives,
      select,
    }),
  );
};

export const useRecentNarratives = (hours: number) => {
  const now = useNow(RECENT_REFETCH_MS);

  const select = useCallback(
    (narratives: Narrative[]) =>
      applyNarrativesQuery(narratives, {
        pageSize: RECENT_PAGE_SIZE,
        from: new Date(now - hours * HOUR_MS).toISOString(),
      }),
    [hours, now],
  );

  return toTableProps(
    useQuery({
      ...RECENT_NARRATIVES_OPTIONS,
      queryKey: narrativeKeys.recent(hours),
      queryFn: fetchNarratives,
      select,
    }),
  );
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
      const previous = queryClient.getQueriesData<Narrative[]>({ queryKey });

      queryClient.setQueriesData<Narrative[]>({ queryKey }, (narratives) =>
        narratives?.map((narrative) =>
          narrative.narrativeId === narrativeId ? { ...narrative, ...changes } : narrative,
        ),
      );

      return { previous };
    },
    onError: (_error, _request, context) => {
      context?.previous.forEach(([key, narratives]) => {
        queryClient.setQueryData(key, narratives);
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
