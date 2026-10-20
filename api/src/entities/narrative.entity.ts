import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity({ schema: 'fresnel', name: 'narrative' })
export class Narrative {
  @PrimaryColumn({ name: 'narrative_id', type: 'text' })
  narrativeId: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ name: 'is_anomaly', type: 'boolean' })
  isAnomaly: boolean;

  @Column({ type: 'text', array: true, nullable: true })
  arena: string[] | null;

  @Column({ name: 'location_name', type: 'text', nullable: true })
  locationName: string | null;

  @Column({ name: 'detected_at', type: 'timestamptz' })
  detectedAt: Date;

  @Column({ type: 'vector', length: 1024, nullable: true, select: false })
  embedding: number[] | null;

  @Column({ type: 'jsonb', nullable: false, default: {} })
  payload: Record<string, any>;

  @Column({ name: 'received_at', type: 'timestamptz', nullable: false, default: () => 'now()' })
  receivedAt: Date;

  @OneToMany(() => Event, (event) => event.narrative)
  events: Event[];
}
