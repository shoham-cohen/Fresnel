import { useSyncExternalStore } from 'react';

// idle: not tried yet · registered: the server has this phone's token · denied: no permission
// unsupported: no Push here (web) · error: registration failed (see the profile screen)
export type PushStatus = 'idle' | 'registered' | 'denied' | 'unsupported' | 'error';

let status: PushStatus = 'idle';
const listeners = new Set<() => void>();

export function setPushStatus(next: PushStatus) {
  if (next === status) return;
  status = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** MAR-18: the Push registration state of this phone, for the profile screen. */
export function usePushStatus(): PushStatus {
  return useSyncExternalStore(subscribe, () => status);
}
