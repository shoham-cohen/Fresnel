import { COMMON_LABEL } from '@/constants/labels';

const pad = (value: number) => String(value).padStart(2, '0');

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// HH:mm for today, dd.MM for earlier days. Used by every list row.
export function formatTime(iso: string): string {
  const date = new Date(iso);
  if (date.toDateString() === new Date().toDateString()) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;
}

/**
 * Today: "12:43". Yesterday: "אתמול, 12:43". Earlier this year: "18.10, 12:43".
 * A previous year: "18.10.25, 12:43".
 */
export function formatDateTime(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (isSameDay(date, now)) return time;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return `${COMMON_LABEL.yesterday}, ${time}`;

  const day = `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;
  if (date.getFullYear() === now.getFullYear()) return `${day}, ${time}`;
  return `${day}.${String(date.getFullYear()).slice(-2)}, ${time}`;
}
