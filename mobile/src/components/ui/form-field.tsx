import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { size } from '@/constants/theme';

type Props = {
  label: string;
  optional?: boolean;
  children: ReactNode;
  flex?: boolean; // usar quando dois campos ficam lado a lado
};

/** Rótulo + conteúdo (input, botões, etc). Todo campo do formulário usa este wrapper. */
export function FormField({ label, optional, children, flex }: Props) {
  return (
    <View style={[styles.wrap, flex && { flex: 1 }]}>
      <ThemedText type="smallBold">
        {label}
        {optional && (
          <ThemedText type="small" themeColor="textSecondary">
            {' '}
            (opcional)
          </ThemedText>
        )}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: size.sm, marginBottom: size.xl },
});