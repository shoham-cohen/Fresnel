import { NarrativeResponseDto } from './narrative-response-dto';

export class NarrativeListPageDto {
  page: number;
  total: number;
  pageSize: number;
  items: NarrativeResponseDto[];
}
