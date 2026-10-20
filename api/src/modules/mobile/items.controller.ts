import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { SourceItemPage } from './dto/source-item';
import { ListItemsQuery } from './dto/list-items.query';
import { ItemsService } from './items.service';

@Controller('events')
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
}
