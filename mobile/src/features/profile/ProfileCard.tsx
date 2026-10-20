import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { AnonymousAvatar } from '@/components/AnonymousAvatar';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { ARENA_LABEL, PROFILE_LABEL, ROLE_LABEL } from '@/constants/labels';
import { colors, fontSize, spacing, textAlignStart } from '@/theme';

// Read-only. Signing out returns to the login screen, where the next sign-in is another mock user.
export function ProfileCard() {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AnonymousAvatar size={96} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.id}>{user.id}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{PROFILE_LABEL.arenas}</Text>
        {user.arenas.length > 0 ? (
          <View style={styles.tags}>
            {user.arenas.map((arena) => (
              <Tag key={arena} label={ARENA_LABEL[arena]} />
            ))}
          </View>
        ) : (
          <Text style={styles.muted}>{PROFILE_LABEL.noArenas}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{PROFILE_LABEL.roles}</Text>
        <View style={styles.tags}>
          {user.roles.map((role) => (
            <Tag key={role} label={ROLE_LABEL[role] ?? role} />
          ))}
        </View>
      </View>

      <Button
        label={PROFILE_LABEL.signOut}
        icon="log-out-outline"
        variant="secondary"
        onPress={signOut}
        style={styles.signOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  id: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    textAlign: textAlignStart,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  muted: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: textAlignStart,
  },
  signOut: {
    marginTop: 'auto',
  },
});
