import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateSimulatedNarrativeDto } from './dto/create-simulated-narrative-dto';
import { NarrativeResponseDto } from './dto/narrative-response-dto';
import { SimulatedNarrativeResponseDto } from './dto/simulated-narrative-response-dto';
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

  @Get('simulated')
  findSimulated(
    @Query('simulationId') simulationId?: string,
  ): Promise<SimulatedNarrativeResponseDto[]> {
    return this.narrativeService.findSimulated(simulationId);
  }

  @Post('simulated')
  createSimulated(
    @Body() createSimulatedNarrativeDto: CreateSimulatedNarrativeDto,
  ): Promise<SimulatedNarrativeResponseDto> {
    return this.narrativeService.createSimulated(createSimulatedNarrativeDto);
  }
}

