import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Narrative } from './narrative.entity';
import { Action } from './action.entity';

export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type EventStatus = 'open' | 'in_progress' | 'closed';

// Title, description, arena and detection time come from the narrative, not stored twice.
@Entity({ schema: 'fresnel', name: 'event' })
export class Event {
  @PrimaryColumn({ name: 'event_id', type: 'uuid', default: () => 'gen_random_uuid()' })
  eventId: string;

  @Column({ name: 'narrative_id', type: 'uuid' })
  narrativeId: string;

  @ManyToOne(() => Narrative, (narrative) => narrative.events)
  @JoinColumn({ name: 'narrative_id' })
  narrative: Narrative;

  @Column({ type: 'text' })
  severity: Severity;

  @Column({ type: 'text' })
  status: EventStatus;

  @Column({ name: 'is_simulation', type: 'boolean' })
  isSimulation: boolean;

  @Column({ name: 'created_by', type: 'text' })
  createdBy: string;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Set by a DB trigger on every UPDATE.
  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
  closedAt: Date | null;

  @Column({ name: 'closed_by', type: 'text', nullable: true })
  closedBy: string | null;

  @Column({ name: 'closure_summary', type: 'text', nullable: true })
  closureSummary: string | null;

  @OneToMany(() => Action, (action) => action.event)
  actions: Action[];
}
