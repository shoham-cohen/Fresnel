import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { CreateEventDto, CreatedEventResponse } from './dto/create-event.dto';
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

  // Opens a new event on an existing narrative.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEventDto): Promise<CreatedEventResponse> {
    return this.eventService.create(dto);
  }
}
