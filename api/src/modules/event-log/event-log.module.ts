import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventLog } from '../../entities';
import { EventLogRepository } from './event-log.repository';
import { EventLogService } from './event-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventLog])],
  providers: [EventLogService, EventLogRepository],
  exports: [EventLogService],
})
export class EventLogModule {}
