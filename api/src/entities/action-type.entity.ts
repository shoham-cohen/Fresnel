import { Column, Entity, PrimaryColumn } from 'typeorm';

// The action bank, chosen from a dropdown.
@Entity({ schema: 'fresnel', name: 'action_type' })
export class ActionType {
  @PrimaryColumn({ type: 'text' })
  code: string;

  @Column({ name: 'label_he', type: 'text' })
  labelHe: string;

  @Column({ type: 'boolean' })
  active: boolean;
}
