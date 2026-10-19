import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Narrative, SimulatedNarrative } from '../../entities';

@Injectable()
export class NarrativeRepository {
  constructor(
    @InjectRepository(Narrative)
    private readonly narrativeOrmRepository: Repository<Narrative>,
    @InjectRepository(SimulatedNarrative)
    private readonly simulatedNarrativeOrmRepository: Repository<SimulatedNarrative>,
  ) {}

  findAll(startDate?: Date, endDate?: Date): Promise<Narrative[]> {
    const where: FindOptionsWhere<Narrative> = {};
    if (startDate && endDate) {
      where.detectedAt = Between(startDate, endDate);
    } else if (startDate) {
      where.detectedAt = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.detectedAt = LessThanOrEqual(endDate);
    }

    return this.narrativeOrmRepository.find({
      where,
      relations: { events: true },
    });
  }

  findOne(narrativeId: string): Promise<Narrative | null> {
    return this.narrativeOrmRepository.findOne({
      where: { narrativeId },
      relations: { events: true },
    });
  }

  findSimulated(simulationId?: string): Promise<SimulatedNarrative[]> {
    return this.simulatedNarrativeOrmRepository.find({
      where: simulationId ? { simulationId } : {},
      relations: { narrative: { events: true } },
    });
  }

  createSimulated(data: {
    narrativeId: string;
    simulationId: string;
  }): Promise<SimulatedNarrative> {
    const simulatedNarrative = this.simulatedNarrativeOrmRepository.create(data);
    
    return this.simulatedNarrativeOrmRepository.save(simulatedNarrative);
  }
}

