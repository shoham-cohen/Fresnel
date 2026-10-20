// HH:mm for today, dd.MM for earlier days. Used by every list row.
export function formatTime(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  if (date.toDateString() === new Date().toDateString()) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;
}
