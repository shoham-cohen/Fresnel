export class PageDto<T> {
  page: number;
  total: number;
  pageSize: number;
  items: T[];
}
