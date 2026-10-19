import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateSimulatedNarrativeDto } from './dto/create-simulated-narrative-dto';
import { NarrativeResponseDto } from './dto/narrative-response-dto';
import { SimulatedNarrativeResponseDto } from './dto/simulated-narrative-response-dto';
import { UpdateNarrativeDto } from './dto/update-narrative-dto';
import { NarrativeService } from './narrative.service';

@Controller('narratives')
export class NarrativeController {
  constructor(private readonly narrativeService: NarrativeService) {}

  @Get()
  findAll(): Promise<NarrativeResponseDto[]> {
    return this.narrativeService.findAll();
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

  // Updates the fields in the body (e.g. { isFlagged: true }) and returns the updated narrative.
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNarrativeDto: UpdateNarrativeDto,
  ): Promise<NarrativeResponseDto> {
    return this.narrativeService.update(id, updateNarrativeDto);
  }
}

