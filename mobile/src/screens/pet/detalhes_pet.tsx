
import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { colors, size } from '@/constants/theme';
import { buscarAnimal, type Animal } from '@/services/animais';
import { Ionicons } from '@expo/vector-icons';

export default function DetalhesPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;

    setCarregando(true);
    setErro(false);

    buscarAnimal(Number(id))
      .then((dados) => {
        if (ativo) setAnimal(dados);
      })
      .catch(() => {
        if (ativo) setErro(true);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="linkPrimary" onPress={() => router.back()}>
          ← Voltar
        </ThemedText>

        {carregando ? (
          <ActivityIndicator color={colors.primary} />
        ) : erro || !animal ? (
          <ThemedText>Não foi possível carregar os dados do pet.</ThemedText>
        ) : (
          <>
            {animal.foto ? (
              <Image source={{ uri: animal.foto }} style={styles.foto} />
            ) : (
              <View style={styles.semFoto}>
                <ThemedText>Sem fotografia</ThemedText>
              </View>
            )}

            <View style={styles.cabecalho}>
              <ThemedText type="title">{animal.nome}</ThemedText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Editar dados do pet"
                onPress={() =>
                  router.push({
                    pathname: '/cadastro-pet',
                    params: { editarId: String(animal.id) },
                  })
                }
              >
                <Ionicons name="pencil-outline" size={26} color={colors.primary} />
              </Pressable>
            </View>

            <View style={styles.dados}>
              <ThemedText>Espécie: {animal.especie === 'cachorro' ? 'Cachorro' : 'Gato'}</ThemedText>
              <ThemedText>Raça: {animal.raca || 'Não informada'}</ThemedText>
              <ThemedText>
                Nascimento: {animal.data_nascimento
                  ? animal.data_nascimento.split('-').reverse().join('/')
                  : 'Não informado'}
              </ThemedText>
              <ThemedText>Sexo: {animal.sexo === 'macho' ? 'Macho' : 'Fêmea'}</ThemedText>
              <ThemedText>Castrado: {animal.castrado ? 'Sim' : 'Não'}</ThemedText>
              <ThemedText>Porte: {animal.porte}</ThemedText>
              <ThemedText>Peso: {animal.peso != null ? `${animal.peso} kg` : 'Não informado'}</ThemedText>
              <ThemedText>Observações: {animal.observacoes || 'Nenhuma'}</ThemedText>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: size.xl,
    gap: size.lg,
  },
  foto: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignSelf: 'center',
  },
  semFoto: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dados: {
    gap: size.md,
    padding: size.lg,
    backgroundColor: colors.surface,
    borderRadius: size.radiusLg,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
