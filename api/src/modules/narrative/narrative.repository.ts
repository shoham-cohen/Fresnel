import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Narrative, SimulatedNarrative } from '../../entities';

@Injectable()
export class NarrativeRepository {
  constructor(
    @InjectRepository(Narrative)
    private readonly narrativeOrmRepository: Repository<Narrative>,
    @InjectRepository(SimulatedNarrative)
    private readonly simulatedNarrativeOrmRepository: Repository<SimulatedNarrative>,
  ) {}

  findAll(): Promise<Narrative[]> {
    return this.narrativeOrmRepository.find({
      relations: { events: true },
    });
  }

  findOne(narrativeId: string): Promise<Narrative | null> {
    return this.narrativeOrmRepository.findOne({
      where: { narrativeId },
      relations: { events: true },
    });
  }

  // Returns the updated narrative, or null when there is no narrative with this id.
  async update(
    narrativeId: string,
    changes: Partial<Pick<Narrative, 'isFlagged'>>,
  ): Promise<Narrative | null> {
    // TypeORM rejects an update with no values, so an empty body just returns the narrative.
    if (Object.keys(changes).length > 0) {
      const { affected } = await this.narrativeOrmRepository.update({ narrativeId }, changes);
      if (!affected) return null;
    }

    return this.findOne(narrativeId);
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

