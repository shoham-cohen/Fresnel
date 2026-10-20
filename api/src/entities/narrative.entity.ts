import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Event } from './event.entity';

export enum Arena {
  IL = 'israel',
  ARAB = 'arab',
  INTL = 'intl',
}

const bigintTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | number | null) => (value != null ? Number(value) : value),
};

@Entity({ schema: 'fresnel', name: 'narrative' })
export class Narrative {
  @PrimaryColumn({ name: 'narrative_id', type: 'uuid' })
  narrativeId: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ name: 'is_anomaly', type: 'boolean' })
  isAnomaly: boolean;

  @Column({ type: 'text', array: true })
  arena: Arena[];

  @Column({ name: 'detected_at', type: 'timestamptz' })
  detectedAt: Date;

  @Column({ type: 'vector', length: 1024, nullable: true, select: false })
  embedding?: number[];

  @Column({ name: 'item_list', type: 'text', array: true })
  itemList: string[];

  @Column({ type: 'text', array: true })
  platforms: string[];

  @Column({ name: 'shares_count', type: 'bigint', transformer: bigintTransformer })
  sharesCount: number;

  @Column({ name: 'views_count', type: 'bigint', transformer: bigintTransformer })
  viewsCount: number;

  @Column({ type: 'text', array: true })
  languages: string[];

  @Column({ name: 'is_flagged', type: 'boolean', default: false })
  isFlagged: boolean;

  @Column({name: 'received_at', type: 'timestamptz'})
  receivedAt: Date;

 @OneToMany(() => Event, event => event.narrative)
  events?: Event[];
}
