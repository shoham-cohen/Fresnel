import { focusManager, QueryClient } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

export const queryClient = new QueryClient();

// Polling stops while the app is in the background, and the open screen refetches when it comes back.
// On web TanStack Query already follows the browser tab.
if (Platform.OS !== 'web') {
  focusManager.setEventListener((setFocused) => {
    const subscription = AppState.addEventListener('change', (state) => setFocused(state === 'active'));
    return () => subscription.remove();
  });
}
