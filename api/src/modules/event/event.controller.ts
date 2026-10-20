import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { CreateEventDto, CreatedEventResponse } from './dto/create-event.dto';
import { EventDetailDto } from './dto/event-detail.dto';
import { EventListPage } from './dto/event-list-item';
import { EventInfoDto, EventStatsDto } from './dto/event-stats.dto';
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
    return this.eventService.getById(id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string): Promise<EventStatsDto> {
    return this.eventService.getStats(id);
  }

  @Get(':id/info')
  getInfo(@Param('id') id: string): Promise<EventInfoDto> {
    return this.eventService.getEventInfo(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEventDto): Promise<CreatedEventResponse> {
    return this.eventService.create(dto);
  }
}
