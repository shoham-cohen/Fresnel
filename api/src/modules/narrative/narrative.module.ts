import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Narrative } from '../../entities';
import { NarrativeController } from './narrative.controller';
import { NarrativeRepository } from './narrative.repository';
import { NarrativeService } from './narrative.service';

@Module({
  imports: [TypeOrmModule.forFeature([Narrative])],
  controllers: [NarrativeController],
  providers: [NarrativeService, NarrativeRepository],
  exports: [NarrativeService],
})
export class NarrativeModule {}
