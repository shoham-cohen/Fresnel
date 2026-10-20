// Van Damme's new-event page; the panel's 'פתיחת אירוע' sends the narrative there.
// TODO: move to an env variable (VITE_VANDAMME_URL) when the apps are deployed.
export const CREATE_EVENT_URL = 'http://localhost:5174/events/new';

export const DETAILS_PANEL_WIDTH = 420;

export const DETAILS_PANEL_TRANSITION = {
  duration: 300,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const PANEL_MARGIN = 10;

export const REALITY_STORAGE_KEY = 'reality';

export const SELECTION_PARAMS = {
  narrativeId: 'narrativeId',
  simulationId: 'simulationId',
} as const;

export const clearSelectionParams = (params: URLSearchParams): URLSearchParams => {
  const next = new URLSearchParams(params);
  next.delete(SELECTION_PARAMS.narrativeId);
  next.delete(SELECTION_PARAMS.simulationId);
  return next;
};
