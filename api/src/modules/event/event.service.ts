import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto, CreatedEventResponse } from './dto/create-event.dto';
import { EventListPage } from './dto/event-list-item';
import { ListEventsQuery } from './dto/list-events.query';
import { EventRepository } from './event.repository';
import { CloseEventDto } from './dto/close-event.dto';
import { SERVITY } from './consts';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

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

  async listClosed(closedAfter: string, closedBefore?: string) {
    const from = new Date(closedAfter);
    if (Number.isNaN(from.getTime())) {
      throw new BadRequestException('closed_after must be a valid ISO-8601 timestamp');
    }

    const to = closedBefore ? new Date(closedBefore) : undefined;
    if (to && Number.isNaN(to.getTime())) {
      throw new BadRequestException('closed_before must be a valid ISO-8601 timestamp');
    }

    const events = await this.eventRepository.findClosedWithinPeriod({
      closedAfter: from,
      closedBefore: to,
    });

    return events.map((event) => ({
      eventId: event.eventId,
      narrativeId: event.narrativeId,
      title: event.narrative.title,
      summary: event.narrative.summary,
      arena: event.narrative.arena,
      createdAt: event.createdAt,
      createdBy: event.createdBy,
      detectedAt: event.narrative.detectedAt,
      closedAt: event.closedAt,
      closedBy: event.closedBy,
      closedSummary: event.closureSummary,
      severity: event.severity,
      status: event.status,
      isSimulation: event.isSimulation,
      actions: event.actions ?? [],
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
      title: narrative.title,
    };
  }
}
