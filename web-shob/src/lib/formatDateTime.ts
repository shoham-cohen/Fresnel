const timeZone = 'Asia/Jerusalem';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export const formatDate = (iso: string): string => {
  return dateFormat.format(new Date(iso));
};

export const formatTime = (iso: string): string => {
  return timeFormat.format(new Date(iso));
};
