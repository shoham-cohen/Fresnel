import { Injectable } from '@nestjs/common';
import { Narrative } from '../../entities';
import { NarrativeRepository } from './narrative.repository';

@Injectable()
export class NarrativeService {
  constructor(private readonly narrativeRepository: NarrativeRepository) {}

  findAll(): Promise<Narrative[]> {
    return this.narrativeRepository.findAll();
  }

  findOne(narrativeId: string): Promise<Narrative | null> {
    return this.narrativeRepository.findOne(narrativeId);
  }
}
