import { Controller, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { ActionService } from './action.service';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) actionId: string): Promise<void> {
    return this.actionService.deleteAction(actionId);
  }
}
