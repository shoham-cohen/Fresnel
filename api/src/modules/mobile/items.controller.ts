import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { EventStats } from './dto/event-stats';
import { SourceItemPage } from './dto/source-item';
import { ListItemsQuery } from './dto/list-items.query';
import { ItemsService } from './items.service';

// The event's Data Lake routes. Under /mobile/events like the rest of the phone's routes:
// GET /api/events/:id/stats belongs to the event module (local DB).
@Controller('mobile/events')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // #61: the event's items for the mobile "מקורות מידע" tab, newest first.
  @Get(':id/items')
  list(
    @Param('id', new ParseUUIDPipe()) eventId: string,
    @Query() query: ListItemsQuery,
  ): Promise<SourceItemPage> {
    return this.itemsService.list(eventId, query);
  }

  // The aggregated numbers and top sources in the "תמונת מצב" tab.
  @Get(':id/stats')
  stats(@Param('id', new ParseUUIDPipe()) eventId: string): Promise<EventStats> {
    return this.itemsService.stats(eventId);
  }
}
