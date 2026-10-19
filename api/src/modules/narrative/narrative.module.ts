import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Narrative, SimulatedNarrative } from '../../entities';
import { NarrativeController } from './narrative.controller';
import { NarrativeService } from './narrative.service';
import { NarrativeRepository } from './narrative.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Narrative, SimulatedNarrative])],
  controllers: [NarrativeController],
  providers: [NarrativeService, NarrativeRepository],
  exports: [NarrativeService],
})
export class NarrativeModule {}

