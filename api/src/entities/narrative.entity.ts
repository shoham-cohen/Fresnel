import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum Arena {  
  IL = 'IL',
  ARAB = 'ARAB',
  INTL = 'INTL'
}

// Written by the שו"ב for every narrative Anomalies sends.
@Entity({ schema: 'fresnel', name: 'narrative' })
export class Narrative {
  // The narrative id in Anomalies; also the key for fetching its items.
  @PrimaryColumn({ name: 'narrative_id', type: 'text' })
  narrativeId: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ name: 'is_anomaly', type: 'boolean' })
  isAnomaly: boolean;

  @Column({ type: 'text', nullable: true })
  arena: Arena | null;

  @Column({ name: 'detected_at', type: 'timestamptz' })
  detectedAt: Date;

  // Only needed by natural-language search, so it is not loaded by default.
  @Column({ type: 'vector', length: 1024, nullable: true, select: false })
  embedding: number[] | null;

  @Column({ name: 'received_at', type: 'timestamptz' })
  receivedAt: Date;

  @Column({ name: 'is_event', type: 'boolean' })
  isEvent: boolean;
}
