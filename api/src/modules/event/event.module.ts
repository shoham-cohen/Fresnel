import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, Narrative } from '../../entities';
import { EventController } from './event.controller';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Narrative])],
  controllers: [EventController],
  providers: [EventService, EventRepository],
  exports: [EventService],
})
export class EventModule {}
