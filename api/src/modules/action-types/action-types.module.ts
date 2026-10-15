import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionType } from '../../entities';
import { ActionTypesController } from './action-types.controller';
import { ActionTypesRepository } from './action-types.repository';
import { ActionTypesService } from './action-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActionType])],
  controllers: [ActionTypesController],
  providers: [ActionTypesService, ActionTypesRepository],
  exports: [ActionTypesService],
})
export class ActionTypesModule {}
