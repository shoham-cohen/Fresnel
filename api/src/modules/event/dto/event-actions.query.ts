import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class EventActionsQuery {
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  isSimulation: boolean;
}
