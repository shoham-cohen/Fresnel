import { Controller, Get } from '@nestjs/common';
import { ActionType } from '../../entities';
import { ActionTypesService } from './action-types.service';

@Controller('action-types')
export class ActionTypesController {
  constructor(private readonly actionTypes: ActionTypesService) {}

  // VD-05: the active action types, for the "add action" dropdown.
  @Get()
  findActive(): Promise<ActionType[]> {
    return this.actionTypes.findActive();
  }
}
