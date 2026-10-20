import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Narrative, SimulatedNarrative } from '../../entities';
import { FindNarrativesQueryDto } from './dto/find-narratives-query-dto';

@Injectable()
export class NarrativeRepository {
  constructor(
    @InjectRepository(Narrative)
    private readonly narrativeOrmRepository: Repository<Narrative>,
    @InjectRepository(SimulatedNarrative)
    private readonly simulatedNarrativeOrmRepository: Repository<SimulatedNarrative>,
  ) {}

  private createNarrativeDateFilterOperator (filter?: FindNarrativesQueryDto): FindOptionsWhere<Narrative> | undefined {
    if (!filter) {
      return undefined;
    }

    const operator: FindOptionsWhere<Narrative> = {};
    const {startDate, endDate} = filter;

    if (startDate && endDate) {
      operator.detectedAt = Between(startDate, endDate);
    } else if (startDate) {
      operator.detectedAt = MoreThanOrEqual(startDate);
    } else if (endDate) {
      operator.detectedAt = LessThanOrEqual(endDate);
    }

    return operator;
  }

  findAll(query?: FindNarrativesQueryDto): Promise<Narrative[]> {
    const dateFilter = this.createNarrativeDateFilterOperator(query);
    
    return this.narrativeOrmRepository.find({
      where: {...dateFilter},
      relations: { events: true },
    });
  }

  findOne(narrativeId: string): Promise<Narrative | null> {
    return this.narrativeOrmRepository.findOne({
      where: { narrativeId },
      relations: { events: true },
    });
  }

  findSimulated(query?: FindNarrativesQueryDto): Promise<SimulatedNarrative[]> {
    const dateFilter = this.createNarrativeDateFilterOperator(query);

    return this.simulatedNarrativeOrmRepository.find({
      where: {
        narrative: {...dateFilter},
      },
      relations: { narrative: { events: true } },
    });
  }

  findOneSimulated(simulationId: string): Promise<SimulatedNarrative | null> {
    return this.simulatedNarrativeOrmRepository.findOne({
      where: { simulationId },
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

