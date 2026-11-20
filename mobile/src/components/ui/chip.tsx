import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { colors, fonts, size } from '@/constants/theme';

type Props = {
  label: string;
  selecionado?: boolean;
  onPress: () => void;
  /** Algo antes do texto, ex.: a patinha do pet. Opcional. */
  inicio?: ReactNode;
  /**
   * 'cheio' = selecionado fica verde com texto branco (filtro da Agenda).
   * 'suave' = selecionado fica verde clarinho com borda (escolhas do formulário).
   */
  variante?: 'cheio' | 'suave';
};

/**
 * Botãozinho arredondado que pode estar selecionado ou não.
 * Usado no filtro de pets da Agenda e nas escolhas do Novo cuidado.
 *
 * Diferente do ChoiceGroup: o Chip tem a largura do próprio texto,
 * então cabem vários numa linha que rola para o lado.
 */
export function Chip({ label, selecionado = false, onPress, inicio, variante = 'cheio' }: Props) {
  const estiloSelecionado = variante === 'cheio' ? styles.cheio : styles.suave;
  const textoSelecionado = variante === 'cheio' ? styles.textoCheio : styles.textoSuave;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: selecionado }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        inicio ? styles.comInicio : null,
        selecionado && estiloSelecionado,
        pressed && !selecionado && styles.pressed,
      ]}>
      {inicio}
      <ThemedText style={[styles.texto, selecionado && textoSelecionado]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: size.choiceHeight,
    paddingHorizontal: size.lg,
    borderRadius: size.radiusPill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: size.xs + 2,
  },
  comInicio: { paddingLeft: size.xs + 2 },
  cheio: { backgroundColor: colors.primary, borderColor: colors.primary },
  suave: { backgroundColor: colors.backgroundSelected, borderColor: colors.primary, borderWidth: 1.5 },
  pressed: { backgroundColor: colors.backgroundSelected },
  texto: { fontSize: size.textSm, fontWeight: fonts.medium, color: colors.text },
  textoCheio: { color: colors.white, fontWeight: fonts.semibold },
  textoSuave: { color: colors.primaryDark, fontWeight: fonts.semibold },
});