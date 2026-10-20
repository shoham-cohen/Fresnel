import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { setPushStatus } from './pushStatus';
import { registerPushDevice } from './registerPush';

/**
 * Registers the phone for Push once the user is signed in (mounted in the signed-in layout), and
 * again whenever the OS rotates the push token.
 */
export function usePushRegistration() {
  useEffect(() => {
    let active = true;

    async function register() {
      try {
        await registerPushDevice();
      } catch {
        // No token, no network, or the server refused: the app works without Push.
        // The profile screen shows it (usePushStatus).
        if (active) setPushStatus('error');
      }
    }

    void register();
    const subscription = Notifications.addPushTokenListener(() => {
      void register();
    });

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
}
