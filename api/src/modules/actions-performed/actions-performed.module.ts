import { Module } from '@nestjs/common';
import { ActionsPerformedController } from './actions-performed.controller';
import { ActionsPerformedService } from './actions-performed.service';
import { MockApiClient } from './mock-api.client';

// The mobile "פעולות שבוצעו" tab: timeline, action types, add, delete and close.
@Module({
  controllers: [ActionsPerformedController],
  providers: [ActionsPerformedService, MockApiClient],
})
export class ActionsPerformedModule {}
