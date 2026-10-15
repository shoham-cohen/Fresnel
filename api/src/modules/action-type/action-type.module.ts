import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionType } from '../../entities';
import { ActionTypeController } from './action-type.controller';
import { ActionTypeRepository } from './action-type.repository';
import { ActionTypeService } from './action-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActionType])],
  controllers: [ActionTypeController],
  providers: [ActionTypeService, ActionTypeRepository],
  exports: [ActionTypeService],
})
export class ActionTypeModule {}
