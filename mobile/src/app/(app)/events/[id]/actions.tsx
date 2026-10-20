import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ActionsFooter } from '@/features/actions/ActionsFooter';
import { ActionsTimeline } from '@/features/actions/ActionsTimeline';

export default function ActionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <ActionsTimeline eventId={id} />
      <ActionsFooter eventId={id} />
    </Screen>
  );
}
