import { Controller, Delete, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth';
import { ActionService } from './action.service';

@Controller('actions')
@UseGuards(AuthGuard)
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) actionId: string): Promise<void> {
    return this.actionService.deleteAction(actionId);
  }
}
