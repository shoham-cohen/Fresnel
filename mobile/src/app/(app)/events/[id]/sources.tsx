import { Screen } from '@/components/Screen';
import { SOURCES_FIXTURE } from '@/features/sources/fixtures';
import { SourcesList } from '@/features/sources/SourcesList';

export default function SourcesScreen() {
  return (
    <Screen>
      <SourcesList items={SOURCES_FIXTURE.items} total={SOURCES_FIXTURE.total} />
    </Screen>
  );
}
