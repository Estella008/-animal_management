import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { colors, fonts, size } from '@/constants/theme';

export type BottomNavItem = {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  active?: boolean;
  onPress?: () => void;
};

type Props = {
  items: BottomNavItem[];
};

export function BottomNav({ items }: Props) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.bar}>
      <View style={styles.row}>
        {items.map((item) => (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityState={{ selected: !!item.active }}
            onPress={item.onPress}
            style={styles.item}>
            <Ionicons
              name={item.icon}
              size={24}
              color={item.active ? colors.primary : colors.text}
            />
            <ThemedText
              numberOfLines={1}
              style={[styles.label, item.active && styles.labelActive]}>
              {item.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  row: { flexDirection: 'row', paddingVertical: size.sm },
  item: { flexGrow: 1, flexBasis: 'auto', alignItems: 'center', gap: size.xs, paddingHorizontal: size.xs },
  label: { fontSize: size.textXs, lineHeight: 16, fontWeight: fonts.medium },
  labelActive: { color: colors.primary, fontWeight: fonts.bold },
});
