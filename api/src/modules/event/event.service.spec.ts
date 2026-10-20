jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
}));

import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { Action, ActionType, Event, EventLog, Narrative } from '../../entities';
import { ActionRepository } from '../action/action.repository';
import { EventLogRepository } from '../event-log/event-log.repository';
import { EventLogService } from '../event-log/event-log.service';
import { CreateEventActionDto } from './dto/create-event-action.dto';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';

describe('EventService', () => {
  describe('listClosed', () => {
    it('returns closed events within the requested window, including narrative and full action details', async () => {
      const action = {
        actionId: '11111111-1111-1111-1111-111111111111',
        eventId: '22222222-2222-2222-2222-222222222222',
        actionTypeCode: 'official_response',
        title: 'Issued public statement',
        description: 'A statement was released.',
        performedBy: 'operator-1',
        performedAt: new Date('2026-10-10T12:00:00.000Z'),
        updatedAt: new Date('2026-10-10T12:30:00.000Z'),
        deletedAt: null,
        deletedBy: null,
        actionType: {
          code: 'official_response',
          labelHe: 'הודעת דו"צ',
          active: true,
        },
      };

      const event = {
        eventId: '22222222-2222-2222-2222-222222222222',
        narrativeId: 'narrative-1',
        title: 'Test narrative',
        summary: 'Narrative summary',
        arena: ['IL', 'INTL'],
        createdAt: new Date('2026-10-01T08:00:00.000Z'),
        createdBy: 'shob.operator',
        detectedAt: new Date('2026-09-30T17:00:00.000Z'),
        closedAt: new Date('2026-10-12T09:00:00.000Z'),
        closedBy: 'dispatcher-1',
        closureSummary: 'Resolved after follow-up',
        severity: 'high',
        status: 'closed',
        isSimulation: false,
        narrative: {
          narrativeId: 'narrative-1',
          title: 'Test narrative',
          summary: 'Narrative summary',
          arena: ['IL', 'INTL'],
          detectedAt: new Date('2026-09-30T17:00:00.000Z'),
        },
        actions: [action],
      } as unknown as Event;

      const repository = {
        findClosedWithinPeriod: jest.fn().mockResolvedValue([event]),
      } as Pick<EventRepository, 'findClosedWithinPeriod'> as EventRepository;

      const service = new EventService(repository, {} as ActionRepository, {} as EventLogService);

      const result = await service.listClosed('2026-10-01T00:00:00.000Z', '2026-10-31T23:59:59.000Z');

      expect(result).toHaveLength(1);
      expect(result[0].eventId).toBe(event.eventId);
      expect(result[0].title).toBe('Test narrative');
      expect(result[0].summary).toBe('Narrative summary');
      expect(result[0].arena).toEqual(['IL', 'INTL']);
      expect(result[0].closedBy).toBe('dispatcher-1');
      expect(result[0].closedSummary).toBe('Resolved after follow-up');
      expect(result[0].actions).toHaveLength(1);
      expect(result[0].actions[0].title).toBe('Issued public statement');
      expect(result[0].actions[0].actionType).toEqual({
        code: 'official_response',
        labelHe: 'הודעת דו"צ',
        active: true,
      });
    });

    it('allows a missing closed_before timestamp', async () => {
      const event = {
        eventId: '33333333-3333-3333-3333-333333333333',
        narrativeId: 'narrative-2',
        createdAt: new Date('2026-10-02T08:00:00.000Z'),
        createdBy: 'shob.operator',
        closedAt: new Date('2026-10-12T09:00:00.000Z'),
        closedBy: 'dispatcher-2',
        closureSummary: 'Closed without upper-bound filter',
        severity: 'medium',
        status: 'closed',
        isSimulation: false,
        narrative: {
          title: 'Another narrative',
          summary: 'Second summary',
          arena: ['ARAB'],
          detectedAt: new Date('2026-09-29T17:00:00.000Z'),
        },
        actions: [],
      } as unknown as Event;

      const repository = {
        findClosedWithinPeriod: jest.fn().mockResolvedValue([event]),
      } as Pick<EventRepository, 'findClosedWithinPeriod'> as EventRepository;

      const service = new EventService(repository, {} as ActionRepository, {} as EventLogService);

      const result = await service.listClosed('2026-10-01T00:00:00.000Z');

      expect(result).toHaveLength(1);
      expect(result[0].eventId).toBe(event.eventId);
      expect(result[0].closedBy).toBe('dispatcher-2');
    });

    it('accepts equal lower and upper bounds', async () => {
      const event = {
        eventId: '44444444-4444-4444-4444-444444444444',
        narrativeId: 'narrative-3',
        createdAt: new Date('2026-10-03T08:00:00.000Z'),
        createdBy: 'shob.operator',
        closedAt: new Date('2026-10-10T10:00:00.000Z'),
        closedBy: 'dispatcher-3',
        closureSummary: 'Exact bound match',
        severity: 'low',
        status: 'closed',
        isSimulation: false,
        narrative: {
          title: 'Bounded narrative',
          summary: 'Boundary summary',
          arena: ['INTL'],
          detectedAt: new Date('2026-09-28T17:00:00.000Z'),
        },
        actions: [],
      } as unknown as Event;

      const repository = {
        findClosedWithinPeriod: jest.fn().mockResolvedValue([event]),
      } as Pick<EventRepository, 'findClosedWithinPeriod'> as EventRepository;

      const service = new EventService(repository, {} as ActionRepository, {} as EventLogService);

      const result = await service.listClosed('2026-10-10T10:00:00.000Z', '2026-10-10T10:00:00.000Z');

      expect(result).toHaveLength(1);
      expect(result[0].closedSummary).toBe('Exact bound match');
    });

    it('rejects an invalid closed_after timestamp', async () => {
      const service = new EventService({} as EventRepository, {} as ActionRepository, {} as EventLogService);

      await expect(service.listClosed('not-a-date')).rejects.toBeInstanceOf(BadRequestException);
      await expect(service.listClosed('not-a-date')).rejects.toThrow(/closed_after/);
    });

    it('rejects an invalid closed_before timestamp', async () => {
      const service = new EventService({} as EventRepository, {} as ActionRepository, {} as EventLogService);

      await expect(service.listClosed('2026-10-01T00:00:00.000Z', 'bad-date')).rejects.toBeInstanceOf(BadRequestException);
      await expect(service.listClosed('2026-10-01T00:00:00.000Z', 'bad-date')).rejects.toThrow(/closed_before/);
    });

    it('rejects an empty closed_after value', async () => {
      const service = new EventService({} as EventRepository, {} as ActionRepository, {} as EventLogService);

      await expect(service.listClosed('')).rejects.toBeInstanceOf(BadRequestException);
      await expect(service.listClosed('')).rejects.toThrow(/closed_after/);
    });
  });

  describe('createActionForEvent', () => {
    let eventRepository: EventRepository;
    let actionRepository: ActionRepository;
    let eventLogService: EventLogService;
    let service: EventService;

    beforeEach(() => {
      eventRepository = new EventRepository(
        {} as Repository<Event>,
        {} as Repository<EventLog>,
        {} as Repository<Narrative>,
      );
      eventRepository.findEventById = jest.fn<Promise<Event | null>, [string]>(async () => null);
      eventRepository.findActive = jest.fn<Promise<[Event[], number]>, [Parameters<EventRepository['findActive']>[0]]>(async () => [[], 0]);
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
      actionRepository.countByEventId = jest.fn(async () => 1);

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
});
