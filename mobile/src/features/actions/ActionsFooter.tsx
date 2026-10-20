import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { AddActionButton } from './add/AddActionButton';
import { CloseEventButton } from './close/CloseEventButton';

type Props = {
  eventId: string;
};

export function ActionsFooter({ eventId }: Props) {
  return (
    <View style={styles.footer}>
      <AddActionButton eventId={eventId} style={styles.button} />
      <CloseEventButton eventId={eventId} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
    backgroundColor: colors.background,
  },
  button: {
    flex: 1,
  },
});
