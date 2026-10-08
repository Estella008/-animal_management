import { Pressable, StyleSheet, type PressableProps } from 'react-native';
 
import { ThemedText } from '@/components/themed-text';
import { colors, fonts, size } from '@/constants/theme';
 
type Props = Omit<PressableProps, 'children'> & { title: string };
 
export function PrimaryButton({ title, disabled, style, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(state) => [
        styles.button,
        state.pressed && styles.pressed,
        disabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      <ThemedText style={styles.label}>{title}</ThemedText>
    </Pressable>
  );
}
 
const styles = StyleSheet.create({
  button: {
    height: size.buttonHeight,
    borderRadius: size.radiusLg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: colors.primaryDark },
  disabled: { opacity: 0.5 },
  label: { color: colors.white, fontWeight: fonts.bold, fontSize: size.textMd },
});