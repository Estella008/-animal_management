import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { colors, size } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/services/api';
import { buscarUsuarioLogado, type Usuario } from '@/services/usuarios';
import { avisarEmBreve } from '@/utils/em-breve';
import { duasPrimeirasLetras } from '@/utils/usuario';

export default function PerfilScreen() {
  const { sair } = useAuth();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;

    setCarregando(true);
    setErro(false);

    // Não precisa de id na rota: o backend descobre o usuário pelo token
    buscarUsuarioLogado()
      .then((dados) => {
        if (ativo) setUsuario(dados);
      })
      .catch((e) => {
        if (!ativo) return;

        // 401 = token vencido ou inválido: volta para o login
        if (e instanceof ApiError && e.status === 401) {
          sair();
          return;
        }
        setErro(true);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [sair]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="linkPrimary" onPress={() => router.back()}>
          ← Voltar
        </ThemedText>

        {carregando ? (
          <ActivityIndicator color={colors.primary} />
        ) : erro || !usuario ? (
          <ThemedText>Não foi possível carregar os seus dados.</ThemedText>
        ) : (
          <>
            {/* O usuário ainda não tem foto, então o avatar mostra as iniciais */}
            <View style={styles.avatar}>
              <ThemedText type="title" themeColor="white">
                {duasPrimeirasLetras(usuario.nome)}
              </ThemedText>
            </View>

            <View style={styles.cabecalho}>
              <ThemedText type="title">Minha conta</ThemedText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Editar dados da conta"
                onPress={() => avisarEmBreve('Editar conta')}
              >
                <Ionicons name="pencil-outline" size={26} color={colors.primary} />
              </Pressable>
            </View>

            <View style={styles.dados}>
              <ThemedText>Nome: {usuario.nome}</ThemedText>
              <ThemedText>E-mail: {usuario.email}</ThemedText>
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
  avatar: {
    width: 120,
    height: 120,
    borderRadius: size.radiusPill,
    backgroundColor: colors.primary,
    alignSelf: 'center',
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