import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventListPage } from './dto/event-list-item';
import { EventDetailDto } from './dto/event-detail.dto';
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

  @Get(':id')
  getById(@Param('id') id: string): Promise<EventDetailDto> {
    return this.eventService.getEventById(id);
  }
}
