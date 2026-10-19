import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { CreateSimulatedNarrativeDto } from './dto/create-simulated-narrative-dto';
import { FindNarrativesQueryDto } from './dto/find-narratives-query-dto';
import { NarrativeResponseDto } from './dto/narrative-response-dto';
import { SimulatedNarrativeResponseDto } from './dto/simulated-narrative-response-dto';
import { NarrativeService } from './narrative.service';

@Controller('narratives')
export class NarrativeController {
  constructor(private readonly narrativeService: NarrativeService) {}

  @Get()
  findAll(
    @Query() query: FindNarrativesQueryDto,
  ): Promise<NarrativeResponseDto[]> {
    return this.narrativeService.findAll(query.startDate, query.endDate);
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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NarrativeResponseDto> {
    const narrative = await this.narrativeService.findOne(id);
    if (!narrative) {
      throw new NotFoundException(`Narrative with id ${id} not found`);
    }
    return narrative;
  }
}

