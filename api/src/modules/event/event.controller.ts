import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { Action } from '../../entities';
import { EventActionsQuery } from './dto/event-actions.query';
import { EventListPage } from './dto/event-list-item';
import { ListEventsQuery } from './dto/list-events.query';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // VD-03: the events lists, always for one of אמת / תרגילית.
  @Get()
  list(@Query() query: ListEventsQuery): Promise<EventListPage> {
    return this.eventService.list(query);
  }

  @Get(':id/actions')
  getActions(
    @Param('id', new ParseUUIDPipe()) eventId: string,
    @Query() query: EventActionsQuery,
  ): Promise<Action[]> {
    return this.eventService.getActionsForEvent(eventId, query.isSimulation);
  }
}
