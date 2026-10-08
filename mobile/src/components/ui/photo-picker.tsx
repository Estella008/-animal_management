// src/components/ui/photo-picker.tsx
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { colors, size } from '@/constants/theme';

type Props = {
  uri?: string | null;
  onPress: () => void; // depois: abrir a galeria com expo-image-picker
};

export function PhotoPicker({ uri, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.row} accessibilityRole="button">
      <View style={styles.circle}>
        {uri ? <Image source={{ uri }} style={styles.image} /> : <ThemedText style={styles.icon}>📷</ThemedText>}
      </View>
      <View>
        <ThemedText type="smallBold">
          Foto do pet{' '}
          <ThemedText type="small" themeColor="textSecondary">
            (opcional)
          </ThemedText>
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Toque para adicionar
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: size.lg, marginBottom: size.xl },
  circle: {
    width: 88,
    height: 88,
    borderRadius: size.radiusPill,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  icon: { fontSize: 26 },
});