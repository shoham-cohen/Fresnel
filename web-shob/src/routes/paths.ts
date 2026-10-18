/**
 * URL paths and the navbar items that link to them.
 *
 * Kept apart from `routes.tsx` so components (like the Navbar) can import the
 * paths without importing every page.
 */
export const paths = {
  home: '/',
  narrativeHistory: '/history',
} as const;

export interface NavItem {
  path: string;
  /** Text shown in the UI (Hebrew). In code the entity is a "narrative". */
  label: string;
}

/** Navbar items in display order (right to left), as in Figma (132:52). */
export const navItems: readonly NavItem[] = [
  { path: paths.home, label: 'מסך ראשי' },
  { path: paths.narrativeHistory, label: 'היסטוריית התראות' },
];
