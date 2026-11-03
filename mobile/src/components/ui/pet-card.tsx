import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { colors, size } from '@/constants/theme';
import type { Animal } from '@/services/animais';

const ESPECIES: Record<Animal['especie'], string> = {
  cachorro: 'Cachorro',
  gato: 'Gato',
};

type Props = {
  animal: Animal;
};

export function PetCard({ animal }: Props) {
  // Se a foto não carregar, o card volta a mostrar a patinha
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const mostrarFoto = animal.foto && !fotoFalhou;
  const descricao = [ESPECIES[animal.especie], animal.raca].filter(Boolean).join(' · ');

  return (
    <View style={styles.card}>
      <View style={styles.thumb}>
        {mostrarFoto ? (
          <Image
            source={{ uri: animal.foto! }}
            style={styles.photo}
            onError={() => setFotoFalhou(true)}
          />
        ) : (
          <Ionicons name="paw" size={24} color={colors.primary} />
        )}
      </View>

      <View style={styles.texts}>
        <ThemedText type="subtitle" numberOfLines={1}>
          {animal.nome}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {descricao}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: size.md,
    padding: size.md,
    borderRadius: size.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  thumb: {
    width: size.petThumb,
    height: size.petThumb,
    borderRadius: size.radiusMd,
    backgroundColor: colors.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  texts: { flex: 1 },
});
