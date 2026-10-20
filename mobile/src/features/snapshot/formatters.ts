import { COMMON_LABEL } from '@/constants/labels';

export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) {
    return COMMON_LABEL.empty;
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return COMMON_LABEL.empty;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes}  ${day}.${month}.${year}`;
}

export function formatNumber(num?: number | null): string {
  if (num === null || num === undefined) {
    return COMMON_LABEL.empty;
  }

  return num.toLocaleString('en-US');
}

