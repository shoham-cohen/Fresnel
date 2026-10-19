import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
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
  @HttpCode(HttpStatus.CREATED)
  async close(@Param('id') id: string, @Body() dto: CloseEventDto, @Res({ passthrough: true }) res: Response): Promise<{ eventId: string } | undefined> {
    try {
      const event = await this.eventService.closeEvent(id, dto);
      return { eventId: event.eventId };
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send(`error occured when tried to close an event with id ${id}`);
      return undefined;
    }
  }
}
