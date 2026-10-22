import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { api, BASE_URL } from '@/services/api';
import { colors, MaxContentWidth, size } from '@/constants/theme';

type Pet = {
  id: number;
  nome: string;
  especie: string;
  foto: string | null;
};

function obterUrlFoto(foto: string | null) {
  if (!foto) return null;

  const servidor = BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');

  if (/^https?:\/\//.test(foto)) {
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(foto)) {
      return servidor + foto.replace(/^https?:\/\/[^/]+/, '');
    }
    return foto;
  }

  return `${servidor}/${foto.replace(/^\/+/, '')}`;
}

export default function MeusPetsScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarPets() {
        setCarregando(true);
        setErro(false);

        try {
          const dados = await api.get<Pet[]>('/animais/listar/');

          if (ativo) {
            setPets(dados);
          }
        } catch (error) {
          console.log('Erro ao buscar animais:', error);

          if (ativo) {
            setErro(true);
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregarPets();

      return () => {
        ativo = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Meus pets
        </ThemedText>

        {carregando ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : erro ? (
          <ThemedText>
            Não foi possível carregar os animais.
          </ThemedText>
        ) : (
          <FlatList
            data={pets}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <ThemedText>
                Nenhum animal cadastrado ainda.
              </ThemedText>
            }
            renderItem={({ item }) => {
              const fotoUrl = obterUrlFoto(item.foto);

              return (
                <Pressable
                  style={styles.card}
                  onPress={() =>
                    Alert.alert(
                      'Em breve',
                      'A tela de detalhes do pet será desenvolvida posteriormente.'
                    )
                  }
                >
                  {fotoUrl ? (
                    <Image
                      source={{ uri: fotoUrl }}
                      style={styles.foto}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.semFoto}>
                      <Ionicons
                        name="paw"
                        size={42}
                        color={colors.primary}
                      />
                    </View>
                  )}

                  <ThemedText type="subtitle" style={styles.nome}>
                    {item.nome}
                  </ThemedText>

                  <ThemedText
                    type="small"
                    style={styles.especie}
                  >
                    {item.especie === 'cachorro'
                      ? 'Cachorro'
                      : item.especie === 'gato'
                        ? 'Gato'
                        : item.especie}
                  </ThemedText>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: size.xxl,
  },
  title: {
    marginBottom: size.xl,
  },
  list: {
    paddingBottom: size.xxxl,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: size.lg,
  },
  card: {
    width: '48%',
    backgroundColor: colors.backgroundElement,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: size.radiusXl,
    padding: size.sm,
    overflow: 'hidden',
  },
  foto: {
    width: '100%',
    height: 150,
    borderRadius: size.radiusMd,
  },
  semFoto: {
    width: '100%',
    height: 150,
    borderRadius: size.radiusMd,
    backgroundColor: colors.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: {
    marginTop: size.sm,
    marginBottom: size.xs,
  },
  especie: {
    color: colors.textSecondary,
    marginBottom: size.xs,
  },
});