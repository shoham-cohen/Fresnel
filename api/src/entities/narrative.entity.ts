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

  @Column({ name: 'detected_at', type: 'timestamptz' })
  detectedAt: Date;

  @Column({ type: 'vector', length: 1024, nullable: true, select: false })
  embedding: number[] | null;

  @Column({ name: 'item_list', type: 'text', array: true })
  itemList: string[];

  @Column({ type: 'text', array: true })
  platforms: string[];

  @Column({ name: 'shares_count', type: 'bigint' })
  sharesCount: number;

  @Column({ name: 'views_count', type: 'bigint' })
  viewsCount: number;

  @Column({ type: 'text', array: true })
  languages: string[];

  @Column({ name: 'is_flagged', type: 'boolean', default: false })
  isFlagged: boolean;

  @Column({ name: 'received_at', type: 'timestamptz', nullable: true })
  receivedAt?: Date;

  @OneToMany(() => Event, (event) => event.narrative)
  events: Event[];
}
