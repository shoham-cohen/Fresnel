import { Controller, Get } from '@nestjs/common';
import { ActionType } from '../../entities';
import { ActionTypeService } from './action-type.service';

@Controller('action-types')
export class ActionTypeController {
  constructor(private readonly actionTypeService: ActionTypeService) {}

  // VD-05: the active action types, for the "add action" dropdown.
  @Get()
  findActive(): Promise<ActionType[]> {
    return this.actionTypeService.findActive();
  }
}
