import {
  Get,
  Body,
  Post,
  Patch,
  Param,
  Query,
  Controller,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';

import { NarrativeService } from './narrative.service';
import { FindNarrativesQueryDto } from './dto/find-narratives-query-dto';
import { UpdateNarrativeDto } from './dto/update-narrative-dto';
import { NarrativeResponseDto } from './dto/narrative-response-dto';
import { NarrativeListPageDto } from './dto/narrative-list-page-dto';
import { ListNarrativesQueryDto } from './dto/list-narratives-query-dto';
import { CreateSimulatedNarrativeDto } from './dto/create-simulated-narrative-dto';
import { SimulatedNarrativeResponseDto } from './dto/simulated-narrative-response-dto';

@Controller('narratives')
export class NarrativeController {
  constructor(private readonly narrativeService: NarrativeService) {}

  @Get()
  findAll(
    @Query() query: FindNarrativesQueryDto,
  ): Promise<NarrativeResponseDto[]> {
    return this.narrativeService.findAll(query);
  }

  @Get('page')
  findPage(@Query() query: ListNarrativesQueryDto): Promise<NarrativeListPageDto> {
    return this.narrativeService.findPage(query);
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

  // Updates the fields in the body (e.g. { isFlagged: true }) and returns the updated narrative.
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNarrativeDto: UpdateNarrativeDto,
  ): Promise<NarrativeResponseDto> {
    return this.narrativeService.update(id, updateNarrativeDto);
  }
}

