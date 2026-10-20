import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventDetail } from './dto/event-detail';
import { OpenEventPage } from './dto/open-event';
import { getJson, MOCK_API_URL } from './mock-api';

export interface FindOpenEventsOptions {
  search?: string;
  page: number;
  pageSize: number;
}

// The only place that fetches the open events list. It reads the mock, so the event ids match the
// mock's items. Once the list comes from the DB, this moves to Eden's EventService.
@Injectable()
export class EventsClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.baseUrl = config.get<string>('MOCK_API_URL') ?? MOCK_API_URL;
  }

  findOpen(
    { search, page, pageSize }: FindOpenEventsOptions,
    authorization?: string,
  ): Promise<OpenEventPage> {
    const params = new URLSearchParams({
      isSimulation: 'false',
      page: String(page),
      pageSize: String(pageSize),
    });
    if (search) params.set('search', search);
    return getJson<OpenEventPage>(`${this.baseUrl}/api/events?${params}`, 'Events source', {
      authorization,
    });
  }

  findById(eventId: string, authorization?: string): Promise<EventDetail> {
    return getJson<EventDetail>(
      `${this.baseUrl}/api/events/${encodeURIComponent(eventId)}`,
      'Events source',
      { authorization },
    );
  }
}
