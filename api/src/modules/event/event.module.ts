import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action, Event } from '../../entities';
import { ActionRepository } from '../action/action.repository';
import { EventLogModule } from '../event-log/event-log.module';
import { EventController } from './event.controller';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Action]), EventLogModule],
  controllers: [EventController],
  providers: [EventService, EventRepository, ActionRepository],
  exports: [EventService],
})
export class EventModule {}
