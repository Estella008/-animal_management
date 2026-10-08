import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
 
import { ThemedText } from '@/components/themed-text';
import { FormField } from '@/components/ui/form-field';
import { colors, fonts, size } from '@/constants/theme';
 
type Props = TextInputProps & {
  label: string;
  optional?: boolean;
  suffix?: string; // ex.: "kg"
  flex?: boolean;
};
 
export function TextField({ label, optional, suffix, flex, multiline, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
 
  return (
    <FormField label={label} optional={optional} flex={flex}>
      <View
        style={[
          styles.box,
          multiline && styles.boxMultiline,
          focused && styles.boxFocused,
        ]}>
        <TextInput
          {...rest}
          multiline={multiline}
          placeholderTextColor={colors.placeholder}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, multiline && styles.inputMultiline, style]}
        />
        {suffix && (
          <ThemedText type="smallBold" themeColor="textSecondary">
            {suffix}
          </ThemedText>
        )}
      </View>
    </FormField>
  );
}
 
const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: size.inputHeight,
    paddingHorizontal: size.inputPaddingHorizontal,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: size.radiusLg,
    gap: size.sm,
  },
  boxMultiline: { height: 110, alignItems: 'flex-start', paddingVertical: size.md },
  boxFocused: { borderColor: colors.primary },
  input: {
    flex: 1,
    fontSize: size.textMd,
    fontWeight: fonts.regular,
    color: colors.text,
    padding: 0,
  },
  inputMultiline: { textAlignVertical: 'top', height: '100%' },
});
 