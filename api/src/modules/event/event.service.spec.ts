jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
}));

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Action, ActionType, Event } from '../../entities';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { ActionRepository } from '../action/action.repository';
import { EventLogService } from '../event-log/event-log.service';
import { EventLogRepository } from '../event-log/event-log.repository';
import { CreateEventActionDto } from './dto/create-event-action.dto';

describe('EventService', () => {
  let eventRepository: EventRepository;
  let actionRepository: ActionRepository;
  let eventLogService: EventLogService;
  let service: EventService;

  beforeEach(() => {
    eventRepository = new EventRepository({} as Repository<Event>);
    eventRepository.findEventById = jest.fn<Promise<Event | null>, [string]>(async (_eventId: string) => null);
    eventRepository.findActive = jest.fn<Promise<[Event[], number]>, [Parameters<EventRepository['findActive']>[0]]>(
      async () => [[], 0],
    );
    eventRepository.updateStatus = jest.fn<Promise<void>, [string, Event['status']]>(async () => undefined);

    actionRepository = new ActionRepository({} as Repository<Action>);
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
    actionRepository.countByEventId = jest.fn<Promise<number>, [string]>(async () => 0);
    actionRepository.findActionsByEventId = jest.fn<Promise<Action[]>, [string]>(async () => []);

    eventLogService = new EventLogService({} as EventLogRepository);
    eventLogService.createLog = jest.fn<Promise<void>, [Parameters<EventLogService['createLog']>[0]]>(async () => undefined);
    eventLogService.logActionCreated = jest.fn<Promise<void>, [Parameters<EventLogService['logActionCreated']>[0]]>(
      async () => undefined,
    );
    eventLogService.logActionDeleted = jest.fn<Promise<void>, [Parameters<EventLogService['logActionDeleted']>[0]]>(
      async () => undefined,
    );

    service = new EventService(eventRepository, actionRepository, eventLogService);
  });

  it('throws when event does not exist', async () => {
    eventRepository.findEventById = jest.fn(async () => null);

    const dto: CreateEventActionDto = {
      actionTypeCode: 'monitor',
      title: 'Follow up',
    };

    await expect(service.createActionForEvent('11111111-1111-1111-1111-111111111111', dto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws when event is closed', async () => {
    eventRepository.findEventById = jest.fn(async () => ({ status: 'closed' } as Event));

    const dto: CreateEventActionDto = {
      actionTypeCode: 'monitor',
      title: 'Follow up',
    };

    await expect(service.createActionForEvent('11111111-1111-1111-1111-111111111111', dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('creates the action, updates status to in_progress, and logs creation when first action is added', async () => {
    const event = {
      eventId: '44444444-4444-4444-4444-444444444444',
      status: 'open',
    } as Event;

    const action: Action = {
      actionId: '55555555-5555-5555-5555-555555555555',
      eventId: event.eventId,
      actionTypeCode: 'monitor',
      title: 'Follow up',
      description: null,
      performedBy: 'vandamme.handler1',
      performedAt: new Date('2026-10-01T00:00:00Z'),
      event: {} as Event,
      actionType: {} as ActionType,
      updatedAt: new Date('2026-10-01T00:00:00Z'),
      deletedAt: null,
      deletedBy: null,
    };

    eventRepository.findEventById = jest.fn(async () => event);
    actionRepository.createForEvent = jest.fn(async () => action);
    actionRepository.countByEventId = jest.fn(async () => 0);

    const dto: CreateEventActionDto = {
      actionTypeCode: 'monitor',
      title: 'Follow up',
      performedBy: 'vandamme.handler1',
    };

    const response = await service.createActionForEvent(event.eventId, dto);

    expect(response).toMatchObject({
      actionId: action.actionId,
      title: action.title,
      actionTypeCode: action.actionTypeCode,
      performedBy: action.performedBy,
    });
    expect(eventRepository.updateStatus).toHaveBeenCalledWith(event.eventId, 'in_progress');
    expect(eventLogService.logActionCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: event.eventId,
        actionId: action.actionId,
        actorId: 'mock_user',
      }),
    );
  });

  it('does not mark the event in_progress when the event already has actions', async () => {
    const event = { eventId: '66666666-6666-6666-6666-666666666666', status: 'open' } as Event;
    const action: Action = {
      actionId: '77777777-7777-7777-7777-777777777777',
      eventId: event.eventId,
      actionTypeCode: 'reporter_contact',
      title: 'Called reporter',
      description: null,
      performedBy: 'vandamme.handler1',
      performedAt: new Date('2026-10-01T00:00:00Z'),
      event: {} as Event,
      actionType: {} as ActionType,
      updatedAt: new Date('2026-10-01T00:00:00Z'),
      deletedAt: null,
      deletedBy: null,
    };

    eventRepository.findEventById = jest.fn(async () => event);
    actionRepository.createForEvent = jest.fn(async () => action);
    actionRepository.countByEventId = jest.fn(async () => 2);

    const dto: CreateEventActionDto = {
      actionTypeCode: 'reporter_contact',
      title: 'Called reporter',
      performedBy: 'vandamme.handler1',
    };

    await service.createActionForEvent(event.eventId, dto);

    expect(eventRepository.updateStatus).not.toHaveBeenCalled();
  });
});
