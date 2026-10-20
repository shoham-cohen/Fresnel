import { Injectable } from '@nestjs/common';
import { EventDetail } from './dto/event-detail';
import { OpenEventPage } from './dto/open-event';
import { ListOpenEventsQuery } from './dto/list-open-events.query';
import { EventsClient } from './events.client';

@Injectable()
export class EventsService {
  constructor(private readonly eventsClient: EventsClient) {}

  listOpen({ search, page, pageSize }: ListOpenEventsQuery): Promise<OpenEventPage> {
    return this.eventsClient.findOpen({ search: search?.trim() || undefined, page, pageSize });
  }

  getById(eventId: string): Promise<EventDetail> {
    return this.eventsClient.findById(eventId);
  }
}
