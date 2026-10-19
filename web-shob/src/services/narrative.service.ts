import type {
  Page,
  NarrativeDto,
  NarrativeUpdate,
  NarrativesQuery,
} from '@/interfaces/narrative-api.interface';

import type { AxiosInstance } from 'axios';
import { toNarrative, toNarrativeDetails } from '@/utilities/narrative.utility';
import { createAxiosInstance } from '@/config/axios.config';
import type { Narrative, NarrativeDetails } from '@/interfaces/narrative.interface';
import { applyNarrativesQuery } from '@/utilities/narrative-query.utility';

class NarrativeService {
  private api: AxiosInstance;

  constructor() {
    this.api = createAxiosInstance('/narratives');
  }

  // TODO: the API returns every narrative and ignores the query, so it's applied here for now.
  // Once GET /api/narratives filters, sorts and pages, send `params: query` and return its page.
  public async getAll(query: NarrativesQuery = {}, signal?: AbortSignal): Promise<Page<Narrative>> {
    const { data } = await this.api.get<NarrativeDto[]>('', { signal });
    return applyNarrativesQuery(data.map(toNarrative), query);
  }

  // GET /api/narratives/:id. A missing narrative is a 404, which axios throws.
  public async getById(narrativeId: string, signal?: AbortSignal): Promise<NarrativeDetails> {
    const { data } = await this.api.get<NarrativeDto>(`/${encodeURIComponent(narrativeId)}`, {
      signal,
    });
    return toNarrativeDetails(data);
  }

  // TODO: the server has no update endpoint yet, so this fails and the change rolls back.
  public async update(narrativeId: string, changes: NarrativeUpdate): Promise<Narrative> {
    const { data } = await this.api.patch<NarrativeDto>(
      `/${encodeURIComponent(narrativeId)}`,
      changes,
    );
    return toNarrative(data);
  }
}

export const narrativeService = new NarrativeService();
