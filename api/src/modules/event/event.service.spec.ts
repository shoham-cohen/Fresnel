import { BadRequestException } from '@nestjs/common';
import { EventService } from './event.service';
import type { EventRepository } from './event.repository';
import type { Event } from '../../entities';

describe('EventService.listClosed', () => {
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

    const service = new EventService(repository);

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

    const service = new EventService(repository);

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

    const service = new EventService(repository);

    const result = await service.listClosed('2026-10-10T10:00:00.000Z', '2026-10-10T10:00:00.000Z');

    expect(result).toHaveLength(1);
    expect(result[0].closedSummary).toBe('Exact bound match');
  });

  it('rejects an invalid closed_after timestamp', async () => {
    const service = new EventService({} as EventRepository);

    await expect(service.listClosed('not-a-date')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.listClosed('not-a-date')).rejects.toThrow(/closed_after/);
  });

  it('rejects an invalid closed_before timestamp', async () => {
    const service = new EventService({} as EventRepository);

    await expect(service.listClosed('2026-10-01T00:00:00.000Z', 'bad-date')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.listClosed('2026-10-01T00:00:00.000Z', 'bad-date')).rejects.toThrow(/closed_before/);
  });

  it('rejects an empty closed_after value', async () => {
    const service = new EventService({} as EventRepository);

    await expect(service.listClosed('')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.listClosed('')).rejects.toThrow(/closed_after/);
  });
});
