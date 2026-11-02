import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { colors, size } from '@/constants/theme';

type Props = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function NoticeCard({ title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.card}>
      <Ionicons name="alert-circle" size={22} color={colors.danger} />

      <View style={styles.content}>
        <ThemedText type="smallBold" themeColor="danger">
          {title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {message}
        </ThemedText>

        {actionLabel ? (
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onAction} style={styles.action}>
            <ThemedText type="smallBold" style={styles.actionLabel}>
              {actionLabel}
            </ThemedText>
            <Ionicons name="arrow-forward" size={14} color={colors.text} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: size.md,
    padding: size.lg,
    borderRadius: size.radiusLg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerBackground,
  },
  content: { flex: 1, gap: size.xs },
  action: { flexDirection: 'row', alignItems: 'center', gap: size.xs, alignSelf: 'flex-start' },
  actionLabel: { textDecorationLine: 'underline' },
});
