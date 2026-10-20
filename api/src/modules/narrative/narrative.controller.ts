import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
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
    return this.narrativeService.findAll(query);
  }

  @Get('simulated')
  findSimulated(
      @Query() query: FindNarrativesQueryDto,
  ): Promise<SimulatedNarrativeResponseDto[]> {
    return this.narrativeService.findSimulated(query);
  }

  @Get('simulated/:simulationId')
  async findOneSimulated(
      @Param('simulationId', new ParseUUIDPipe()) simulationId: string,
  ): Promise<SimulatedNarrativeResponseDto> {
    const simulatedNarrative = await this.narrativeService.findOneSimulated(simulationId);
    
    if (!simulatedNarrative) {
      throw new NotFoundException(`Simulated narrative with id ${simulationId} not found`);
    }

    return simulatedNarrative;
  }


  @Post('simulated')
  createSimulated(
    @Body() createSimulatedNarrativeDto: CreateSimulatedNarrativeDto,
  ): Promise<SimulatedNarrativeResponseDto> {
    return this.narrativeService.createSimulated(createSimulatedNarrativeDto);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<NarrativeResponseDto> {
    const narrative = await this.narrativeService.findOne(id);
    if (!narrative) {
      throw new NotFoundException(`Narrative with id ${id} not found`);
    }
    return narrative;
  }
}

