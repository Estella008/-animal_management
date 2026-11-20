import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { colors, fonts, size } from '@/constants/theme';

export function BottomNav({ state, descriptors, emitter, navigateToTab }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.bar}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const ativa = state.index === index;
          const label = options.title ?? route.name;
          const cor = ativa ? colors.primary : colors.text;

          function abrirAba() {
            const evento = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!ativa && !evento.defaultPrevented) {
              navigateToTab(route.key);
            }
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: ativa }}
              onPress={abrirAba}
              style={styles.item}>
              {options.tabBarIcon?.({ focused: ativa, color: cor, size: 24 })}
              <ThemedText numberOfLines={1} style={[styles.label, ativa && styles.labelActive]}>
                {label}
              </ThemedText>
            </Pressable>

          );
        })}
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