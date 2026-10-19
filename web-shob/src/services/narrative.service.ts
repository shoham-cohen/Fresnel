import type { AxiosInstance } from 'axios';

import type { Narrative } from '@/interfaces/narrative.interface';
import { createAxiosInstance, USE_MOCKS } from '@/config/axios.config';
import type { NarrativeDto, NarrativesQuery, Page } from '@/interfaces/narrative-api.interface';
import { getMockNarrativesPage } from '@/mocks/narratives.mock';
import { toNarrative } from '@/utilities/narrative.utility';

class NarrativeService {
  private api: AxiosInstance;

  constructor() {
    this.api = createAxiosInstance('/narratives');
  }

  /**
   * GET /api/narratives: one page of narratives matching `query`, mapped for the table.
   * Errors are thrown, so the caller (react-query) can show the error state and retry.
   */
  public async getAll(query: NarrativesQuery = {}, signal?: AbortSignal): Promise<Page<Narrative>> {
    const page = USE_MOCKS
      ? await getMockNarrativesPage(query)
      : (await this.api.get<Page<NarrativeDto>>('', { params: query, signal })).data;

    return { ...page, items: page.items.map(toNarrative) };
  }
}

export const narrativeService = new NarrativeService();
