import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ActionsTimeline } from '@/features/actions/ActionsTimeline';

export default function ActionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <ActionsTimeline eventId={id} />
    </Screen>
  );
}
