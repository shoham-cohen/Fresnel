import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateEventDto, CreatedEventResponse } from './dto/create-event.dto';
import { EventListPage } from './dto/event-list-item';
import { ListEventsQuery } from './dto/list-events.query';
import { CloseEventDto } from './dto/close-event.dto';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  list(@Query() query: ListEventsQuery): Promise<EventListPage> {
    return this.eventService.list(query);
  }

  @Post(':id/close')
  @HttpCode(HttpStatus.OK)
  async close(@Param('id') id: string, @Body() dto: CloseEventDto, @Res({ passthrough: true }) res: Response): Promise<void> {
    try {
      await this.eventService.closeEvent(id, dto);
      return;
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send(`error occured when tried to close an event with id ${id}`);
      return;
    }
  }

  @Post(':id/reopen')
  @HttpCode(HttpStatus.OK)
  async reopen(@Param('id') id: string, @Res({ passthrough: true }) res: Response): Promise<void> {
    try {
      await this.eventService.reopenEvent(id);
      return;
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send(`error occured when tried to reopen event with ${id}`);
      return;
    }
  }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEventDto): Promise<CreatedEventResponse> {
    return this.eventService.create(dto);
  }
}
