import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth';
import { ActionType } from '../../entities';
import { ActionTypeService } from './action-type.service';

@Controller('action-types')
@UseGuards(AuthGuard)
export class ActionTypeController {
  constructor(private readonly actionTypeService: ActionTypeService) {}

  // VD-05: the active action types, for the "add action" dropdown.
  @Get()
  findActive(): Promise<ActionType[]> {
    return this.actionTypeService.findActive();
  }
}
