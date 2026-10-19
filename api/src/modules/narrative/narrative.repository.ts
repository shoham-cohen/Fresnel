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
    return this.narrativeOrmRepository.find();
  }

  findOne(narrativeId: string): Promise<Narrative | null> {
    return this.narrativeOrmRepository.findOneBy({ narrativeId });
  }

  findSimulated(simulationId?: string): Promise<SimulatedNarrative[]> {
    return this.simulatedNarrativeOrmRepository.find({
      where: simulationId ? { simulationId } : {},
      relations: { narrative: true },
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

