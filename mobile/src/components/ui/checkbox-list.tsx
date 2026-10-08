// src/components/ui/checkbox-list.tsx
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FormField } from '@/components/ui/form-field';
import { colors, fonts, size } from '@/constants/theme';

type Props = {
  label: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
};

/** Lista de caixinhas de marcar (vacinas). */
export function CheckboxList({ label, items, selected, onToggle }: Props) {
  return (
    <FormField label={label}>
      <View style={styles.card}>
        {items.map((item, i) => {
          const checked = selected.includes(item);
          return (
            <Pressable
              key={item}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              onPress={() => onToggle(item)}
              style={[styles.row, i > 0 && styles.divider]}>
              <View style={[styles.box, checked && styles.boxChecked]}>
                {checked && <ThemedText style={styles.check}>✓</ThemedText>}
              </View>
              <ThemedText type="small">{item}</ThemedText>
            </Pressable>
          );
        })}
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: size.radiusLg,
    paddingHorizontal: size.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: size.md, height: 44 },
  divider: { borderTopWidth: 1, borderTopColor: colors.divider },
  box: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  check: { color: colors.white, fontSize: 13, lineHeight: 16, fontWeight: fonts.bold },
});