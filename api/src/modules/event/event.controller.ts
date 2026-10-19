import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { EventActionItem } from './dto/event-action-item';
import { CreateEventActionDto } from './dto/create-event-action.dto';
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

  @Post(':id/actions')
  createAction(
    @Param('id', new ParseUUIDPipe()) eventId: string,
    @Body() dto: CreateEventActionDto,
  ): Promise<EventActionItem> {
    return this.eventService.createActionForEvent(eventId, dto);
  }

  @Get(':id/actions')
  getActions(@Param('id', new ParseUUIDPipe()) eventId: string): Promise<EventActionItem[]> {
    return this.eventService.getActionsForEvent(eventId);
  }
}
