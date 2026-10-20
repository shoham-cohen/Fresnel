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

class NarrativeService {
  private api: AxiosInstance;

  constructor() {
    this.api = createAxiosInstance('/narratives');
  }

  public async getPage(query: NarrativesQuery, signal?: AbortSignal): Promise<Page<Narrative>> {
    const { data } = await this.api.get<Page<NarrativeDto>>('/page', { params: query, signal });
    return { ...data, items: data.items.map(toNarrative) };
  }

  public async getById(narrativeId: string, signal?: AbortSignal): Promise<NarrativeDetails> {
    const { data } = await this.api.get<NarrativeDto>(`/${encodeURIComponent(narrativeId)}`, {
      signal,
    });
    return toNarrativeDetails(data);
  }

  public async update(narrativeId: string, changes: NarrativeUpdate): Promise<Narrative> {
    const { data } = await this.api.patch<NarrativeDto>(
      `/${encodeURIComponent(narrativeId)}`,
      changes,
    );
    return toNarrative(data);
  }
}

export const narrativeService = new NarrativeService();
