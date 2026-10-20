import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ActionRepository } from '../action/action.repository';
import { EventLogService } from '../event-log/event-log.service';
import { EventActionItem } from './dto/event-action-item';
import { CreateEventActionDto } from './dto/create-event-action.dto';
import { EventListPage } from './dto/event-list-item';
import { ListEventsQuery } from './dto/list-events.query';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly actionRepository: ActionRepository,
    private readonly eventLogService: EventLogService,
  ) {}

  async list({ isSimulation, search, page, pageSize }: ListEventsQuery): Promise<EventListPage> {
    const [events, total] = await this.eventRepository.findActive({
      isSimulation,
      search: search?.trim() || undefined,
      page,
      pageSize,
    });

    return {
      items: events.map((e) => ({
        eventId: e.eventId,
        title: e.narrative.title,
        status: e.status,
        severity: e.severity,
        createdAt: e.createdAt,
      })),
      total,
      page,
      pageSize,
    };
  }

  async createActionForEvent(eventId: string, dto: CreateEventActionDto): Promise<EventActionItem> {
    const event = await this.eventRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException(`Event ${eventId} not found`);
    }

    if (event.status === 'closed') {
      throw new BadRequestException(`Event ${eventId} is closed and cannot accept new actions`);
    }

    const action = await this.actionRepository.createForEvent(eventId, {
      actionTypeCode: dto.actionTypeCode,
      title: dto.title,
      description: dto.description ?? null,
      performedBy: dto.performedBy ?? 'vandamme.handler1',
    });

    if ((await this.actionRepository.countByEventId(eventId)) === 0 && event.status === 'open') {
      await this.eventRepository.updateStatus(eventId, 'in_progress');
    }

    await this.eventLogService.logActionCreated({
      eventId,
      actionId: action.actionId,
      actorId: 'mock_user',
      details: {
        title: action.title,
        actionType: action.actionTypeCode,
        performedBy: action.performedBy,
      },
      client: 'web',
    });

    return {
      actionId: action.actionId,
      title: action.title,
      description: action.description,
      actionTypeCode: action.actionTypeCode,
      performedBy: action.performedBy,
      performedAt: action.performedAt,
    };
  }

  async getActionsForEvent(eventId: string): Promise<EventActionItem[]> {
    const event = await this.eventRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException(`Event ${eventId} not found`);
    }

    const actions = await this.actionRepository.findActionsByEventId(eventId);

    return actions.map((action) => ({
      actionId: action.actionId,
      title: action.title,
      description: action.description,
      actionTypeCode: action.actionTypeCode,
      performedBy: action.performedBy,
      performedAt: action.performedAt,
    }));
  }
}
