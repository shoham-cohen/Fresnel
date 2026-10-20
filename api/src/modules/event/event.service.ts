import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto, CreatedEventResponse } from './dto/create-event.dto';
import { EventDetailDto } from './dto/event-detail.dto';
import { EventListPage } from './dto/event-list-item';
import { EventInfoDto, EventStatsDto, TopSourceDto } from './dto/event-stats.dto';
import { ListEventsQuery } from './dto/list-events.query';
import { EventRepository } from './event.repository';
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

  async getById(id: string): Promise<EventDetailDto> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event '${id}' not found`);
    }

    return {
      eventId: event.eventId,
      narrativeId: event.narrativeId,
      title: event.narrative.title,
      summary: event.narrative.summary,
      arena: event.narrative.arena ?? [],
      detectedAt: event.narrative.detectedAt,
      isAnomaly: event.narrative.isAnomaly,
      severity: event.severity,
      status: event.status,
      isSimulation: event.isSimulation,
      createdBy: event.createdBy,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      closedAt: event.closedAt,
      closedBy: event.closedBy,
      closureSummary: event.closureSummary,
    };
  }

  async getStats(id: string): Promise<EventStatsDto> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event '${id}' not found`);
    }

    const narrative = event.narrative;
    const posts = narrative?.itemList?.length ?? 0;
    const views = narrative?.viewsCount != null ? Number(narrative.viewsCount) : null;
    const shares = narrative?.sharesCount != null ? Number(narrative.sharesCount) : null;
    const topSources: TopSourceDto[] = (narrative?.platforms ?? []).map((platform) => ({
      platform,
      count: 0,
    }));

    return {
      posts,
      views,
      shares,
      comments: null,
      topSources,
      basedOn: Math.min(posts, 100),
      asOf: new Date().toISOString(),
    };
  }

  async getEventInfo(id: string): Promise<EventInfoDto> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event '${id}' not found`);
    }

    const narrative = event.narrative;
    const posts = narrative?.itemList?.length ?? 0;
    const views = narrative?.viewsCount != null ? Number(narrative.viewsCount) : null;
    const shares = narrative?.sharesCount != null ? Number(narrative.sharesCount) : null;
    const topSources: TopSourceDto[] = (narrative?.platforms ?? []).map((platform) => ({
      platform,
      count: 0,
    }));

    return {
      eventId: event.eventId,
      narrativeId: event.narrativeId,
      title: narrative.title,
      summary: narrative.summary,
      arena: narrative.arena ?? [],
      detectedAt: narrative.detectedAt,
      updatedAt: event.updatedAt,
      createdAt: event.createdAt,
      status: event.status,
      severity: event.severity,
      isAnomaly: narrative.isAnomaly,
      posts,
      views,
      shares,
      comments: null,
      topSources,
      basedOn: Math.min(posts, 100),
      asOf: new Date().toISOString(),
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
