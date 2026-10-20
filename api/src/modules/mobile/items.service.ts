import { Injectable } from '@nestjs/common';
import { DataLakeClient } from './data-lake.client';
import { EventStats } from './dto/event-stats';
import { SourceItemPage } from './dto/source-item';
import { ListItemsQuery } from './dto/list-items.query';

@Injectable()
export class ItemsService {
  constructor(private readonly dataLakeClient: DataLakeClient) {}

  list(
    eventId: string,
    { page, pageSize }: ListItemsQuery,
    authorization?: string,
  ): Promise<SourceItemPage> {
    return this.dataLakeClient.findEventItems(eventId, page, pageSize, authorization);
  }

  stats(eventId: string, authorization?: string): Promise<EventStats> {
    return this.dataLakeClient.findEventStats(eventId, authorization);
  }
}
