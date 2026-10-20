import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SourceItemPage } from './dto/source-item';
import { getJson, MOCK_API_URL } from './mock-api';

// The only place that talks to the items source. Moving to the real server changes this file only.
@Injectable()
export class DataLakeClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    // The mock until the real Data Lake is wired up.
    this.baseUrl = config.get<string>('DATA_LAKE_URL') ?? MOCK_API_URL;
  }

  findEventItems(eventId: string, page: number, pageSize: number): Promise<SourceItemPage> {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    return getJson<SourceItemPage>(
      `${this.baseUrl}/api/events/${encodeURIComponent(eventId)}/items?${params}`,
      'Data Lake',
    );
  }
}
