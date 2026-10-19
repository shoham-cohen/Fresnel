import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Event } from './event.entity';

export enum Arena {
  IL = 'israel',
  ARAB = 'arab',
  INTL = 'intl',
}

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
  arena: Arena[] | null;

  @Column({ name: 'detected_at', type: 'timestamptz' })
  detectedAt: Date;

  @Column({ type: 'vector', length: 1024, nullable: true, select: false })
  embedding: number[] | null;

  @Column({ name: 'item_list', type: 'text', array: true, nullable: true })
  itemList: string[] | null;

  @Column({ type: 'text', array: true, nullable: true })
  platforms: string[] | null;

  @Column({ name: 'shares_count', type: 'bigint', nullable: true })
  sharesCount: number | null;

  @Column({ name: 'views_count', type: 'bigint', nullable: true })
  viewsCount: number | null;

  @Column({ type: 'text', array: true, nullable: true })
  languages: string[] | null;

  @Column({ name: 'is_flagged', type: 'boolean', default: false })
  isFlagged: boolean;

  @Column({name: 'received_at', type: 'timestamptz', nullable: true})
  receivedAt?: Date;

 @OneToMany(() => Event, event => event.narrative)
  events: Event[];
}
