import { Module } from '@nestjs/common';
import { AuthClient } from './auth.client';
import { AuthController } from './auth.controller';
import { DataLakeClient } from './data-lake.client';
import { EventsClient } from './events.client';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

// Team Marconi's routes for the mobile app.
@Module({
  controllers: [AuthController, EventsController, ItemsController],
  providers: [AuthClient, EventsService, EventsClient, ItemsService, DataLakeClient],
})
export class MobileModule {}
