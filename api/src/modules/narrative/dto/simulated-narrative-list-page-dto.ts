import { SimulatedNarrativeResponseDto } from './simulated-narrative-response-dto';

export class SimulatedNarrativeListPageDto {
  page: number;
  total: number;
  pageSize: number;
  items: SimulatedNarrativeResponseDto[];
}