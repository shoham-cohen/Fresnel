import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MobileAuthGuard } from './auth/mobile-auth.guard';
import { OpenEventPage } from './dto/open-event';
import { ListOpenEventsQuery } from './dto/list-open-events.query';
import { EventsService } from './events.service';

// Not under /events: GET /api/events belongs to the event module.
@Controller('mobile/events')
@UseGuards(MobileAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // #94: the open real events (open + in_progress) for the mobile home screen, newest first.
  @Get()
  listOpen(@Query() query: ListOpenEventsQuery): Promise<OpenEventPage> {
    return this.eventsService.listOpen(query);
  }
}
