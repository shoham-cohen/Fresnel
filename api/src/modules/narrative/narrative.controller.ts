import {
  Get,
  Body,
  Post,
  Patch,
  Param,
  Query,
  Controller,
  NotFoundException,
  ParseArrayPipe,
} from '@nestjs/common';

import { NarrativeService } from './narrative.service';
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
  findAll(): Promise<NarrativeResponseDto[]> {
    return this.narrativeService.findAll();
  }

  @Get('page')
  findPage(@Query() query: ListNarrativesQueryDto): Promise<NarrativeListPageDto> {
    return this.narrativeService.findPage(query);
  }

  @Get('simulated')
  findSimulated(
    @Query('simulationId') simulationId?: string,
  ): Promise<SimulatedNarrativeResponseDto[]> {
    return this.narrativeService.findSimulated(simulationId);
  }

  @Post('simulated')
  createSimulated(
    @Body(new ParseArrayPipe({ items: CreateSimulatedNarrativeDto }))
    createSimulatedNarrativeDto: CreateSimulatedNarrativeDto[],
  ): Promise<SimulatedNarrativeResponseDto[]> {
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNarrativeDto: UpdateNarrativeDto,
  ): Promise<NarrativeResponseDto> {
    return this.narrativeService.update(id, updateNarrativeDto);
  }
}

