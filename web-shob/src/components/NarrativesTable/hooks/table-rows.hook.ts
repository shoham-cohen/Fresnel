import { useEffect, useMemo, useState } from 'react';
import { useElementHeight } from '@/hooks/element-height.hook';
import { rowsThatFit } from '../utilities/rows-that-fit.utility';
import type { Narrative } from '@/interfaces/narrative.interface';
import type { SortKey, SortState } from '../interfaces/sort.interface';
import type { NarrativesTablePaging } from '../interfaces/paging.interface';
import { nextSort, sortNarratives } from '../utilities/sort-narratives.utility';

const DEFAULT_PAGE_SIZE = 10;

interface TableRowsOptions {
  narratives: readonly Narrative[];
  controlledSort: SortState | null | undefined;
  onSortChange: ((sort: SortState) => void) | undefined;
  paging: NarrativesTablePaging | undefined;
}

export const useTableRows = ({
  narratives,
  controlledSort,
  onSortChange,
  paging,
}: TableRowsOptions) => {
  const [localSort, setLocalSort] = useState<SortState | null>(null);
  const isSortControlled = controlledSort !== undefined;
  const sort = isSortControlled ? controlledSort : localSort;

  const sorted = useMemo(
    () => (isSortControlled ? narratives : sortNarratives(narratives, localSort)),
    [narratives, localSort, isSortControlled],
  );

  const [areaRef, areaHeight] = useElementHeight<HTMLDivElement>();
  const pageSize = areaHeight ? rowsThatFit(areaHeight) : DEFAULT_PAGE_SIZE;

  const onPageSizeChange = paging?.onPageSizeChange;
  useEffect(() => {
    if (areaHeight > 0) onPageSizeChange?.(pageSize); 
  }, [areaHeight, pageSize, onPageSizeChange]);

  const [localPage, setLocalPage] = useState(1);

  const [lastPageSize, setLastPageSize] = useState(pageSize);
  if (pageSize !== lastPageSize) {
    setLastPageSize(pageSize);
    setLocalPage(1);
  }

  const total = paging ? paging.total : sorted.length;
  const page = paging ? paging.page : Math.min(localPage, Math.max(1, Math.ceil(total / pageSize)));

  const rows = useMemo(
    () => (paging ? sorted : sorted.slice((page - 1) * pageSize, page * pageSize)),
    [paging, sorted, page, pageSize],
  );

  const handleSort = (key: SortKey) => {
    const next = nextSort(sort, key);

    if (!isSortControlled) {
      setLocalSort(next);
    }
    if (!paging) {
      setLocalPage(1);
    }
    onSortChange?.(next);
  };

  return {
    sort,
    rows,
    page,
    total,
    areaRef,
    pageSize,
    handleSort,
    firstRowNumber: (page - 1) * pageSize + 1,
    handlePageChange: paging ? paging.onPageChange : setLocalPage,
  };
};
