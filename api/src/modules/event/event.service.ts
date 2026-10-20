import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ActionRepository } from '../action/action.repository';
import { EventLogService } from '../event-log/event-log.service';
import { EventActionItem } from './dto/event-action-item';
import { CreateEventActionDto } from './dto/create-event-action.dto';
import { CreateEventDto, CreatedEventResponse } from './dto/create-event.dto';
import { EventListPage } from './dto/event-list-item';
import { EventDetailDto } from './dto/event-detail.dto';
import { ListEventsQuery } from './dto/list-events.query';
import { EventRepository } from './event.repository';
import { CloseEventDto } from './dto/close-event.dto';
import { SERVITY } from './consts';

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

  async getEventById(id: string): Promise<EventDetailDto> {
    const event = await this.eventRepository.findByIdWithNarrative(id);

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    const arenaValue = event.narrative?.arena ?? null;

    return {
      eventId: event.eventId,
      narrativeId: event.narrativeId,
      title: event.narrative?.title ?? '',
      description: event.narrative?.summary ?? null,
      arena: arenaValue,
      detectedAt: event.narrative?.detectedAt ?? event.createdAt,
      openedBy: event.createdBy,
      closedBy: event.closedBy,
      status: event.status,
      severity: event.severity,
      isSimulation: event.isSimulation,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      closedAt: event.closedAt,
      closureSummary: event.closureSummary,
    };
  }
  
  async createActionForEvent(eventId: string, dto: CreateEventActionDto): Promise<EventActionItem> {
    const event = await this.eventRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException(`Event ${eventId} not found`);
    }

    const action = await this.actionRepository.createForEvent(eventId, {
      actionTypeCode: dto.actionTypeCode,
      title: dto.title,
      description: dto.description ?? null,
      performedBy: dto.performedBy ?? 'vandamme.handler1',
    });

    if ((await this.actionRepository.countByEventId(eventId)) === 1 && event.status === 'open') {
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

  async closeEvent(id: string, dto: CloseEventDto): Promise<void> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error(`error occured when tried to close an event with id ${id}`);
    }

    await this.eventRepository.close(id, {
      closedBy: dto.closedBy,
      closureSummary: dto.closureSummary,
    });
  }

  async reopenEvent(id: string): Promise<void> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error(`error occured when tried to reopen event with ${id}`);
    }

    await this.eventRepository.reopen(id);
  }

  async create(dto: CreateEventDto): Promise<CreatedEventResponse> {
    const narrativeId = dto.narrativeId;
    if (!narrativeId) {
      throw new BadRequestException('narrativeId is required');
    }

    const narrative = await this.eventRepository.findNarrativeById(narrativeId);
    if (!narrative) {
      throw new NotFoundException(`Narrative '${narrativeId}' not found`);
    }

    const severity = dto.severity ?? SERVITY.MEDIUM;
    const isSimulation = dto.isSimulation ?? false;
    const createdBy = dto.createdBy ?? 'shob.operator';

    const event = await this.eventRepository.create({
      narrativeId,
      severity,
      isSimulation,
      createdBy,
    });

    return {
      ...event,
      title: narrative.title
    };
  }
}
