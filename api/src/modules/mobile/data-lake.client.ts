import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SourceItemPage } from './dto/source-item';

// The mock server (fresnel-mock-api) until the real Data Lake is wired up.
const DEFAULT_DATA_LAKE_URL = 'https://fresnel-mock-api.onrender.com';

// The only place that talks to the items source. Moving to the real server changes this file only.
@Injectable()
export class DataLakeClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.baseUrl = config.get<string>('DATA_LAKE_URL') ?? DEFAULT_DATA_LAKE_URL;
  }

  async findEventItems(eventId: string, page: number, pageSize: number): Promise<SourceItemPage> {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    const url = `${this.baseUrl}/api/events/${encodeURIComponent(eventId)}/items?${params}`;

    let response: Response;
    try {
      response = await fetch(url, { headers: { Accept: 'application/json', 'X-Client': 'mobile' } });
    } catch {
      throw new BadGatewayException('Data Lake is unreachable');
    }

    if (response.status === 404) throw new NotFoundException(`Event ${eventId} not found`);
    if (response.status === 403) throw new ForbiddenException();
    // Any other failure of the source is ours to report as 502, not to pass through.
    if (!response.ok) throw new BadGatewayException(`Data Lake returned ${response.status}`);

    return (await response.json()) as SourceItemPage;
  }
}
