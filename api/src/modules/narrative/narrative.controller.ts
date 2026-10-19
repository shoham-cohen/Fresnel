import { Controller, Get, Param } from '@nestjs/common';
import { NarrativeResponseDto } from './dto/narrative-response-dto';
import { NarrativeService } from './narrative.service';

@Controller('narratives')
export class NarrativeController {
  constructor(private readonly narrativeService: NarrativeService) {}

  @Get()
  findAll(): Promise<NarrativeResponseDto[]> {
    return this.narrativeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<NarrativeResponseDto | null> {
    return this.narrativeService.findOne(id);
  }
}
