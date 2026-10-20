import { useSyncExternalStore } from 'react';
import { isUnauthorized, subscribeUnauthorized } from '@/auth/unauthorized.store';

export const useUnauthorized = () => useSyncExternalStore(subscribeUnauthorized, isUnauthorized);
