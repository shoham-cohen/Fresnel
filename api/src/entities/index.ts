import { Action } from './action.entity';
import { ActionType } from './action-type.entity';
import { Event } from './event.entity';
import { EventLog } from './event-log.entity';
import { Narrative } from './narrative.entity';

import { SimulatedNarrative } from './simulated-narrative.entity';

export * from './action.entity';
export * from './action-type.entity';
export * from './event.entity';
export * from './event-log.entity';
export * from './narrative.entity';
export * from './simulated-narrative.entity';

// Every table in the fresnel schema. db/schema.sql is the source of truth;
// TypeORM only maps to it and never changes the schema (synchronize is off).
export const entities = [Narrative, Event, ActionType, Action, EventLog, SimulatedNarrative];

