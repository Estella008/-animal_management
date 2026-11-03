import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

import { HomeHeader } from '@/components/ui/home-header';
import { NoticeCard } from '@/components/ui/notice-card';
import { PetList } from '@/components/ui/pet-list';
import { SideMenu } from '@/components/ui/side-menu';
import { colors, MaxContentWidth, size } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { listarAnimais, type Animal } from '@/services/animais';
import { ApiError } from '@/services/api';
import { buscarUsuarioLogado, type Usuario } from '@/services/usuarios';
import { avisarEmBreve } from '@/utils/em-breve';

export default function HomeScreen() {
  const router = useRouter();
  const { sair } = useAuth();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro(false);

    try {
      const [dadosUsuario, listaAnimais] = await Promise.all([
        buscarUsuarioLogado(),
        listarAnimais(),
      ]);
      setUsuario(dadosUsuario);
      setAnimais(listaAnimais);
    } catch (e) {
      console.log('Erro ao carregar a Home:', e);

      // 401 = token vencido ou inválido: volta para o login
      if (e instanceof ApiError && e.status === 401) {
        await sair();
        return;
      }
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, [sair]);

  // useFocusEffect roda sempre que a tela aparece, inclusive ao voltar do
  // cadastro. É assim que um animal novo já surge na lista.
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados]),
  );

  const irParaCadastro = () => router.push('/cadastro-pet');



  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomeHeader nome={usuario?.nome ?? ''} onAvatarPress={() => setMenuAberto(true)} />

        {/* Aviso apenas ilustrativo: depois virá da agenda de cada animal */}
        <NoticeCard
          title="Acompanhamento próximo"
          message="Thor tem consulta em 02 out para acompanhar a displasia no quadril."
          actionLabel="Ver ficha"
          onAction={() => avisarEmBreve('Ficha do animal')}
        />

        <View style={styles.section}>
          <ThemedText type="subtitle">Meus animais</ThemedText>
          <PetList
            animais={animais}
            carregando={carregando}
            erro={erro}
            onTentarNovamente={carregarDados}
            onCadastrar={irParaCadastro}
          />
        </View>
      </ScrollView>

      

      <SideMenu
        visible={menuAberto}
        nome={usuario?.nome ?? ''}
        email={usuario?.email ?? ''}
        onClose={() => setMenuAberto(false)}
        onEditarConta={() => avisarEmBreve('Editar conta')}
        onConfiguracoes={() => avisarEmBreve('Configurações')}
        onSair={sair}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: size.xl,
    padding: size.xl,
  },
  section: {
    gap: size.md,
  },
});
