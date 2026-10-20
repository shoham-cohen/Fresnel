// How often each screen refetches while it is focused (there is no socket).
export const POLL = {
  list: 15_000, // events list, event card, timeline
  dataLake: 60_000, // stats and items
};
