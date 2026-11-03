import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { colors, fonts, size } from '@/constants/theme';
import { duasPrimeirasLetras } from '@/utils/usuario';

type Props = {
  nome: string;
  onPress?: () => void;
};

export function UserAvatar({ nome, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Abrir menu da conta"
      disabled={!onPress}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.circle, pressed && styles.pressed]}>
      {nome ? (
        <ThemedText style={styles.letters}>{duasPrimeirasLetras(nome)}</ThemedText>
      ) : (
        <Ionicons name="person" size={22} color={colors.white} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: size.avatar,
    height: size.avatar,
    borderRadius: size.radiusPill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: colors.primaryDark },
  letters: { color: colors.white, fontWeight: fonts.bold },
});
