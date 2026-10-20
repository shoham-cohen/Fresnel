import { Screen } from '@/components/Screen';
import { OpenEventsList } from '@/features/events/OpenEventsList';

export default function HomeScreen() {
  return (
    <Screen>
      <OpenEventsList />
    </Screen>
  );
}
