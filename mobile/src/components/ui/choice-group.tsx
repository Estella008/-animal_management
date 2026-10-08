import { Pressable, StyleSheet, View } from 'react-native';
 
import { ThemedText } from '@/components/themed-text';
import { FormField } from '@/components/ui/form-field';
import { colors, fonts, size } from '@/constants/theme';
 
type Option<T extends string> = { label: string; value: T };
 
type Props<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  flex?: boolean;
};
 
/** Grupo de botões de escolha única: Macho/Fêmea, Sim/Não, Pequeno/Médio/Grande, Espécie. */
export function ChoiceGroup<T extends string>({ label, options, value, onChange, flex }: Props<T>) {
  return (
    <FormField label={label} flex={flex}>
      <View style={styles.row}>
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(opt.value)}
              style={[styles.choice, selected && styles.choiceSelected]}>
              <ThemedText style={[styles.text, selected && styles.textSelected]}>
                {opt.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </FormField>
  );
}
 
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: size.sm },
  choice: {
    flex: 1,
    height: size.choiceHeight,
    borderRadius: size.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontSize: size.textSm, fontWeight: fonts.semibold, color: colors.text },
  textSelected: { color: colors.white },
});