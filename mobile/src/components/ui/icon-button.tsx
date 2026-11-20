import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { colors, size } from '@/constants/theme';

type Props = {
  icone: keyof typeof Ionicons.glyphMap;
  /** Obrigatório: é o que o leitor de tela fala, já que o botão não tem texto. */
  accessibilityLabel: string;
  onPress: () => void;
  /** 'contorno' = quadrado com borda (ex.: calendário). 'simples' = só o ícone (ex.: voltar). */
  variante?: 'contorno' | 'simples';
};

/** Botão quadrado só com ícone. Ex.: abrir calendário, voltar, editar. */
export function IconButton({ icone, accessibilityLabel, onPress, variante = 'contorno' }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variante === 'contorno' && styles.contorno,
        pressed && styles.pressed,
      ]}>
      <Ionicons name={icone} size={22} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // 44x44 é o tamanho mínimo recomendado para um toque confortável
  base: {
    width: 44,
    height: 44,
    borderRadius: size.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contorno: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: { backgroundColor: colors.backgroundSelected },
});