import { Controller, Get, Param } from '@nestjs/common';
import { Narrative } from '../../entities';
import { NarrativeService } from './narrative.service';

@Controller('narratives')
export class NarrativeController {
  constructor(private readonly narrativeService: NarrativeService) {}

  @Get()
  findAll(): Promise<Narrative[]> {
    return this.narrativeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Narrative | null> {
    return this.narrativeService.findOne(id);
  }
}
