import { Module } from '@nestjs/common';
import { DataLakeClient } from './data-lake.client';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

// Team Marconi's routes for the mobile app.
@Module({
  controllers: [ItemsController],
  providers: [ItemsService, DataLakeClient],
})
export class MobileModule {}
