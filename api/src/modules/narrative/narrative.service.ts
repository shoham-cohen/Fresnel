import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { NarrativeResponseDto } from './dto/narrative-response-dto';
import { NarrativeRepository } from './narrative.repository';

@Injectable()
export class NarrativeService {
  constructor(private readonly narrativeRepository: NarrativeRepository) {}

  async findAll(): Promise<NarrativeResponseDto[]> {
    const narratives = await this.narrativeRepository.findAll();
    return plainToInstance(NarrativeResponseDto, narratives);
  }

  async findOne(narrativeId: string): Promise<NarrativeResponseDto | null> {
    const narrative = await this.narrativeRepository.findOne(narrativeId);
    return narrative ? plainToInstance(NarrativeResponseDto, narrative) : null;
  }
}
