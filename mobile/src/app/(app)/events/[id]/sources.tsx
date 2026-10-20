import { useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/Screen';
import { SourcesList } from '@/features/sources/SourcesList';

export default function SourcesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <SourcesList eventId={id} />
    </Screen>
  );
}
