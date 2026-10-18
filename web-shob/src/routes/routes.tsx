import type { RouteObject } from 'react-router';

import { RootLayout } from '@/app/RootLayout';
import { HomePage } from '@/pages/home/HomePage';
import { NarrativeHistoryPage } from '@/pages/narrative-history/NarrativeHistoryPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';

import { paths } from './paths';

/**
 * Central route config. To add a page: create it under `src/pages/`, add its
 * path to `paths.ts`, register it here and, if it belongs in the navbar,
 * add it to `navItems`.
 */
export const routes: RouteObject[] = [
  {
    path: paths.home,
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: paths.narrativeHistory, element: <NarrativeHistoryPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
