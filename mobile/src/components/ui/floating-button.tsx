import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { colors, size } from '@/constants/theme';

type Props = {
  /** Obrigatório: o botão não tem texto, então o leitor de tela fala isso. */
  accessibilityLabel: string;
  onPress: () => void;
  icone?: keyof typeof Ionicons.glyphMap;
};

/**
 * Botão redondo que "flutua" no canto da tela (o famoso FAB).
 * Ex.: o "+" da Agenda que abre o Novo cuidado.
 *
 * Ele usa position: 'absolute', então coloque-o FORA do ScrollView,
 * como último filho da tela. Assim ele fica parado enquanto a lista rola.
 */
export function FloatingButton({ accessibilityLabel, onPress, icone = 'add' }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.botao, pressed && styles.pressed]}>
      <Ionicons name={icone} size={28} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    position: 'absolute',
    right: size.xl,
    bottom: size.xl,
    width: 56,
    height: 56,
    borderRadius: size.radiusXl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // sombra (iOS usa shadow*, Android usa elevation)
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  pressed: { backgroundColor: colors.primaryDark },
});