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
  ParseArrayPipe,
} from '@nestjs/common';

import { NarrativeService } from './narrative.service';
import { UpdateNarrativeDto } from './dto/update-narrative-dto';
import { NarrativeResponseDto } from './dto/narrative-response-dto';
import { NarrativeListPageDto } from './dto/narrative-list-page-dto';
import { FindNarrativesQueryDto } from './dto/find-narratives-query-dto';
import { ListNarrativesQueryDto } from './dto/list-narratives-query-dto';
import { CreateSimulatedNarrativeDto } from './dto/create-simulated-narrative-dto';
import { SimulatedNarrativeResponseDto } from './dto/simulated-narrative-response-dto';
import { SimulatedNarrativeListPageDto } from './dto/simulated-narrative-list-page-dto';

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
  findPage(
    @Query() query: ListNarrativesQueryDto,
  ): Promise<NarrativeListPageDto | SimulatedNarrativeListPageDto> {
    return query.isSimulation
      ? this.narrativeService.findSimulatedPage(query)
      : this.narrativeService.findPage(query);
  }

  @Get('simulated')
  findSimulated(
      @Query() query: FindNarrativesQueryDto,
  ): Promise<SimulatedNarrativeResponseDto[]> {
    return this.narrativeService.findSimulated(query);
  }

  @Get('simulated/one')
  async findOneSimulated(
    @Query('simulationId', new ParseUUIDPipe()) simulationId: string,
    @Query('narrativeId', new ParseUUIDPipe()) narrativeId: string,
  ): Promise<SimulatedNarrativeResponseDto> {
    const simulatedNarrative = await this.narrativeService.findOneSimulated(
      simulationId,
      narrativeId,
    );

    if (!simulatedNarrative) {
      throw new NotFoundException(
        `Simulated narrative with narrativeId '${narrativeId}' and simulationId '${simulationId}' not found`,
      );
    }

    return simulatedNarrative;
  }

  @Post('simulated')
  createSimulated(
    @Body(new ParseArrayPipe({ items: CreateSimulatedNarrativeDto }))
    createSimulatedNarrativeDto: CreateSimulatedNarrativeDto[],
  ): Promise<SimulatedNarrativeResponseDto[]> {
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNarrativeDto: UpdateNarrativeDto,
  ): Promise<NarrativeResponseDto> {
    return this.narrativeService.update(id, updateNarrativeDto);
  }
}

