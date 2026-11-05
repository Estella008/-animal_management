import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { colors, size } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/services/api';
import { atualizarUsuario, buscarUsuarioLogado } from '@/services/usuarios';

export default function EditarContaScreen() {
  const { sair } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Preenche o formulário com os dados atuais da conta
  useEffect(() => {
    let ativo = true;

    buscarUsuarioLogado()
      .then((dados) => {
        if (!ativo) return;
        setNome(dados.nome);
        setEmail(dados.email);
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

  const handleSalvar = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    const emailNormalizado = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      Alert.alert('E-mail inválido', 'Digite um endereço de e-mail válido.');
      return;
    }

    setSalvando(true);

    try {
      await atualizarUsuario({ nome: nome.trim(), email: emailNormalizado });

      // A tela de perfil busca os dados de novo ao reaparecer
      router.back();
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        await sair();
        return;
      }

      const data = e instanceof ApiError ? (e.data as Record<string, unknown> | null) : null;

      if (e instanceof ApiError && e.status === 400 && data?.email) {
        Alert.alert('E-mail indisponível', 'Este e-mail já está cadastrado ou é inválido.');
      } else if (e instanceof ApiError) {
        Alert.alert('Erro ao salvar', `O servidor retornou o erro ${e.status}.`);
      } else {
        Alert.alert(
          'Erro de conexão',
          'Não foi possível acessar o servidor. Verifique sua conexão e tente novamente.',
        );
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="linkPrimary" onPress={() => router.back()}>
            ← Voltar
          </ThemedText>

          <ThemedText type="title">Editar conta</ThemedText>

          {carregando ? (
            <ActivityIndicator color={colors.primary} />
          ) : erro ? (
            <ThemedText>Não foi possível carregar os seus dados.</ThemedText>
          ) : (
            <>
              <TextField
                label="Nome completo"
                value={nome}
                placeholder="Como podemos te chamar?"
                onChangeText={setNome}
              />

              <TextField
                label="E-mail"
                value={email}
                placeholder="seuemail@exemplo.com"
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <PrimaryButton
                title={salvando ? 'Salvando...' : 'Salvar alterações'}
                onPress={handleSalvar}
                disabled={salvando}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    padding: size.xl,
    gap: size.lg,
  },
});