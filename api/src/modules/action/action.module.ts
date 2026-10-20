import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from '../../entities';
import { EventLogModule } from '../event-log/event-log.module';
import { ActionController } from './action.controller';
import { ActionRepository } from './action.repository';
import { ActionService } from './action.service';

@Module({
  imports: [TypeOrmModule.forFeature([Action]), EventLogModule],
  controllers: [ActionController],
  providers: [ActionService, ActionRepository],
  exports: [ActionService, ActionRepository],
})
export class ActionModule {}
