import type { NarrativeDto, NarrativeUpdate } from '@/interfaces/narrative-api.interface';

import type { AxiosInstance } from 'axios';
import { toNarrative, toNarrativeDetails } from '@/utilities/narrative.utility';
import { createAxiosInstance } from '@/config/axios.config';
import type { Narrative, NarrativeDetails } from '@/interfaces/narrative.interface';

class NarrativeService {
  private api: AxiosInstance;

  constructor() {
    this.api = createAxiosInstance('/narratives');
  }

  // TODO: once it does, take a NarrativesQuery, send it as `params` and return the server's page.
  public async getAll(signal?: AbortSignal): Promise<Narrative[]> {
    const { data } = await this.api.get<NarrativeDto[]>('', { signal });
    return data.map(toNarrative);
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
