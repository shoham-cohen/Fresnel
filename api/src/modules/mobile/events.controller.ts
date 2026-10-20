import { Controller, Get, Headers, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { EventDetail } from './dto/event-detail';
import { OpenEventPage } from './dto/open-event';
import { ListOpenEventsQuery } from './dto/list-open-events.query';
import { EventsService } from './events.service';

// Not under /events: GET /api/events and /api/events/:id belong to the event module (local DB),
// while the phone reads the mock, so its event ids match the mock's items and stats.
@Controller('mobile/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // #94: the open real events (open + in_progress) for the mobile home screen, newest first.
  @Get()
  listOpen(
    @Query() query: ListOpenEventsQuery,
    @Headers('authorization') authorization?: string,
  ): Promise<OpenEventPage> {
    return this.eventsService.listOpen(query, authorization);
  }

  // The event card in the "תמונת מצב" tab.
  @Get(':id')
  getById(
    @Param('id', new ParseUUIDPipe()) eventId: string,
    @Headers('authorization') authorization?: string,
  ): Promise<EventDetail> {
    return this.eventsService.getById(eventId, authorization);
  }
}
