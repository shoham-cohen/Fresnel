// Van Damme's new-event page; the panel's 'פתיחת אירוע' sends the narrative there.
// TODO: move to an env variable (VITE_VANDAMME_URL) when the apps are deployed.
export const CREATE_EVENT_URL = 'http://localhost:5174/events/new';

export const DETAILS_PANEL_WIDTH = 420;

export const DETAILS_PANEL_TRANSITION = {
  duration: 300,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
