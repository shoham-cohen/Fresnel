import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto, CreatedEventResponse } from './dto/create-event.dto';
import { EventListPage } from './dto/event-list-item';
import { ListEventsQuery } from './dto/list-events.query';
import { EventRepository } from './event.repository';

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

  async create(dto: CreateEventDto): Promise<CreatedEventResponse> {
    const narrativeId = dto.narrativeId;
    if (!narrativeId) {
      throw new BadRequestException('narrativeId is required');
    }

    const narrative = await this.eventRepository.findNarrativeById(narrativeId);
    if (!narrative) {
      throw new NotFoundException(`Narrative '${narrativeId}' not found`);
    }

    const severity = dto.severity ?? 'medium';
    const isSimulation = dto.isSimulation ?? false;
    const createdBy = dto.createdBy ?? 'shob.operator';

    const event = await this.eventRepository.create({
      narrativeId,
      severity,
      isSimulation,
      createdBy,
    });

    return {
      eventId: event.eventId,
      narrativeId: event.narrativeId,
      title: narrative.title,
      status: event.status,
      severity: event.severity,
      isSimulation: event.isSimulation,
      createdBy: event.createdBy,
      createdAt: event.createdAt,
    };
  }
}