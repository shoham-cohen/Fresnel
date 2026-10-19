import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Narrative } from './narrative.entity';

@Entity({ schema: 'fresnel', name: 'simulated_narrative' })
export class SimulatedNarrative {
  // FK to narrative.narrative_id which is text — must stay text.
  @PrimaryColumn({ name: 'narrative_id', type: 'text' })
  narrativeId: string;

  @PrimaryColumn({ name: 'simulation_id', type: 'uuid' })
  simulationId: string;

  @ManyToOne(() => Narrative)
  @JoinColumn({ name: 'narrative_id' })
  narrative: Narrative;
}
