jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
}));

import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Action, ActionType, Event } from '../../entities';
import { ActionService } from './action.service';
import { ActionRepository } from './action.repository';
import { EventLogService } from '../event-log/event-log.service';
import { EventLogRepository } from '../event-log/event-log.repository';

describe('ActionService', () => {
  let actionRepository: ActionRepository;
  let eventLogService: EventLogService;
  let service: ActionService;

  beforeEach(() => {
    actionRepository = new ActionRepository({} as Repository<Action>);
    actionRepository.findById = jest.fn<Promise<Action | null>, [string]>(async () => null);
    actionRepository.softDelete = jest.fn<Promise<void>, [string]>(async () => undefined);
    actionRepository.countByEventId = jest.fn<Promise<number>, [string]>(async () => 0);
    actionRepository.createForEvent = jest.fn<Promise<Action>, [string, Parameters<ActionRepository['createForEvent']>[1]]>(
      async () => ({
        actionId: '00000000-0000-0000-0000-000000000001',
        eventId: '00000000-0000-0000-0000-000000000002',
        title: 'seed action',
        description: null,
        actionTypeCode: 'monitor',
        performedBy: 'vandamme.handler1',
        performedAt: new Date('2026-10-01T00:00:00Z'),
        event: {} as Event,
        actionType: {} as ActionType,
        updatedAt: new Date('2026-10-01T00:00:00Z'),
        deletedAt: null,
        deletedBy: null,
      }),
    );
    actionRepository.findActionsByEventId = jest.fn<Promise<Action[]>, [string]>(async () => []);

    eventLogService = new EventLogService({} as EventLogRepository);
    eventLogService.createLog = jest.fn<Promise<void>, [Parameters<EventLogService['createLog']>[0]]>(async () => undefined);
    eventLogService.logActionCreated = jest.fn<Promise<void>, [Parameters<EventLogService['logActionCreated']>[0]]>(
      async () => undefined,
    );
    eventLogService.logActionDeleted = jest.fn<Promise<void>, [Parameters<EventLogService['logActionDeleted']>[0]]>(
      async () => undefined,
    );

    service = new ActionService(actionRepository, eventLogService);
  });

  it('throws when action does not exist', async () => {
    actionRepository.findById = jest.fn(async () => null);

    await expect(service.deleteAction('11111111-1111-1111-1111-111111111111')).rejects.toThrow(NotFoundException);
    await expect(service.deleteAction('11111111-1111-1111-1111-111111111111')).rejects.toThrow(
      'already deleted or does not exist',
    );
  });

  it('soft deletes and logs the action when it is active', async () => {
    const action: Action = {
      actionId: '22222222-2222-2222-2222-222222222222',
      eventId: '33333333-3333-3333-3333-333333333333',
      title: 'Checked source',
      actionTypeCode: 'fact_check',
      description: null,
      performedBy: 'vandamme.handler1',
      performedAt: new Date('2026-10-01T00:00:00Z'),
      event: {} as Event,
      actionType: {} as ActionType,
      updatedAt: new Date('2026-10-01T00:00:00Z'),
      deletedAt: null,
      deletedBy: null,
    };

    actionRepository.findById = jest.fn(async () => action);
    eventLogService.logActionDeleted = jest.fn(async () => undefined);

    await expect(service.deleteAction(action.actionId)).resolves.toBeUndefined();
    expect(actionRepository.softDelete).toHaveBeenCalledWith(action.actionId);
    expect(eventLogService.logActionDeleted).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: action.eventId,
        actionId: action.actionId,
        actorId: 'mock_user',
      }),
    );
  });
});
