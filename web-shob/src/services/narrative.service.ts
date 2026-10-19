import type {
  Page,
  NarrativeDto,
  NarrativeUpdate,
  NarrativesQuery,
} from '@/interfaces/narrative-api.interface';

import type { AxiosInstance } from 'axios';
import type { Narrative } from '@/interfaces/narrative.interface';
import { createAxiosInstance, USE_MOCKS } from '@/config/axios.config';
import { getMockNarrativesPage, updateMockNarrative } from '@/mocks/narratives.mock';

class NarrativeService {
  private api: AxiosInstance;

  constructor() {
    this.api = createAxiosInstance('/narratives');
  }

  public async getAll(query: NarrativesQuery = {}, signal?: AbortSignal): Promise<Page<Narrative>> {
    if (USE_MOCKS) {
      return getMockNarrativesPage(query);
    }

    const { data } = await this.api.get<Page<NarrativeDto>>('', { params: query, signal });
    return data;
  }

  public async update(narrativeId: string, changes: NarrativeUpdate): Promise<NarrativeDto> {
    if (USE_MOCKS) {
      return updateMockNarrative(narrativeId, changes);
    }

    const { data } = await this.api.patch<NarrativeDto>(
      `/${encodeURIComponent(narrativeId)}`,
      changes,
    );
    return data;
  }
}

export const narrativeService = new NarrativeService();
