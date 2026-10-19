import { Injectable, NotFoundException } from '@nestjs/common';
import { EventLogService } from '../event-log/event-log.service';
import { ActionRepository } from './action.repository';

@Injectable()
export class ActionService {
  constructor(
    private readonly actionRepository: ActionRepository,
    private readonly eventLogService: EventLogService,
  ) {}

  async deleteAction(actionId: string): Promise<void> {
    const action = await this.actionRepository.findById(actionId);

    if (!action) {
      throw new NotFoundException(`Action ${actionId} was already deleted or does not exist`);
    }

    await this.actionRepository.softDelete(actionId);

    await this.eventLogService.logActionDeleted({
      eventId: action.eventId,
      actionId: action.actionId,
      actorId: 'mock_user',
      details: {
        title: action.title,
        actionTypeCode: action.actionTypeCode,
      },
      client: 'system',
    });
  }
}
