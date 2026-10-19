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
