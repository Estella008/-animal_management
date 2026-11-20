import { useCallback, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgendaList } from '@/components/ui/agenda-list';
import { Chip } from '@/components/ui/chip';
import { FloatingButton } from '@/components/ui/floating-button';
import { IconButton } from '@/components/ui/icon-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { colors, MaxContentWidth, size } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { listarEventos, listarVacinasDaAgenda } from '@/services/agenda';
import { listarAnimais, type Animal } from '@/services/animais';
import { ApiError } from '@/services/api';
import {
  agruparHistorico,
  agruparProximos,
  estaAtrasado,
  eventoParaItem,
  vacinasParaItens,
  type ItemAgenda,
} from '@/utils/agenda';
import { avisarEmBreve } from '@/utils/em-breve';

type Aba = 'proximos' | 'historico';

const ABAS: { label: string; value: Aba }[] = [
  { label: 'Próximos', value: 'proximos' },
  { label: 'Histórico', value: 'historico' },
];

export default function AgendaScreen() {
  const { sair } = useAuth();

  // ----- Dados que vêm da API -----
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [itens, setItens] = useState<ItemAgenda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  // ----- Escolhas da tutora na tela -----
  const [aba, setAba] = useState<Aba>('proximos');
  const [petSelecionado, setPetSelecionado] = useState<number | null>(null); // null = Todos

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro(false);

    try {
      // As três buscas acontecem ao mesmo tempo (mais rápido que uma por vez)
      const [listaAnimais, eventos, vacinas] = await Promise.all([
        listarAnimais(),
        listarEventos(),
        listarVacinasDaAgenda(),
      ]);

      // Junta eventos e vacinas no formato único ItemAgenda.
      // Eventos cancelados não aparecem na agenda nem no histórico.
      const itensEventos = eventos
        .filter((evento) => evento.status !== 'cancelado')
        .map(eventoParaItem);
      const { proximas, aplicadas } = vacinasParaItens(vacinas);

      setAnimais(listaAnimais);
      setItens([...itensEventos, ...proximas, ...aplicadas]);
    } catch (e) {
      console.log('Erro ao carregar a Agenda:', e);

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

  // Recarrega sempre que a tela aparece (ex.: ao voltar do Novo cuidado)
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados]),
  );

  // { 3: 'Thor', 5: 'Mia' }: para o card mostrar o nome do pet
  const nomesPets = useMemo(
    () => Object.fromEntries(animais.map((animal) => [animal.id, animal.nome])),
    [animais],
  );

  // useMemo: só refaz as contas quando os itens, o pet ou a aba mudam
  const { grupos, atrasados } = useMemo(() => {
    const doPet = petSelecionado ? itens.filter((item) => item.animal === petSelecionado) : itens;

    if (aba === 'historico') {
      return { grupos: agruparHistorico(doPet), atrasados: [] };
    }
    return {
      grupos: agruparProximos(doPet),
      atrasados: doPet.filter((item) => estaAtrasado(item)),
    };
  }, [itens, petSelecionado, aba]);

  // Por enquanto, estas ações avisam "em breve" (como as outras telas fazem).
  // Elas serão ligadas nos próximos passos.
  const abrirNovoCuidado = () => avisarEmBreve('Novo cuidado');
  const abrirDetalhe = (_item: ItemAgenda) => avisarEmBreve('Detalhe do cuidado');
  const resolverAtrasado = (_item: ItemAgenda) => avisarEmBreve('Marcar como realizado');

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          titulo="Agenda"
          subtitulo="Cuidados dos seus pets"
          direita={
            <IconButton
              icone="calendar-outline"
              accessibilityLabel="Ver em calendário"
              onPress={() => avisarEmBreve('Calendário')}
            />
          }
        />

        {/* Filtro de pets: rola para o lado se tiver muitos */}
        {animais.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Chip label="Todos" selecionado={petSelecionado === null} onPress={() => setPetSelecionado(null)} />
            {animais.map((animal) => (
              <Chip
                key={animal.id}
                label={animal.nome}
                selecionado={petSelecionado === animal.id}
                onPress={() => setPetSelecionado(animal.id)}
                inicio={
                  <View style={styles.patinha}>
                    <Ionicons name="paw" size={13} color={colors.primary} />
                  </View>
                }
              />
            ))}
          </ScrollView>
        ) : null}

        <SegmentedControl opcoes={ABAS} valor={aba} onChange={setAba} />

        <AgendaList
          grupos={grupos}
          atrasados={atrasados}
          nomesPets={nomesPets}
          carregando={carregando}
          erro={erro}
          onTentarNovamente={carregarDados}
          onSelecionar={abrirDetalhe}
          onResolverAtrasado={resolverAtrasado}
          mensagemVazia={
            aba === 'proximos'
              ? 'Nenhum cuidado agendado por aqui.'
              : 'Os cuidados realizados aparecem aqui.'
          }
          vazio={aba === 'proximos' ? { titulo: 'Agendar um cuidado', onPress: abrirNovoCuidado } : undefined}
        />
      </ScrollView>

      {/* Fora do ScrollView para ficar parado no canto */}
      <FloatingButton accessibilityLabel="Novo cuidado" onPress={abrirNovoCuidado} />
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
    gap: size.lg,
    padding: size.xl,
    // espaço no fim para o botão "+" não cobrir o último card
    paddingBottom: size.xl + 56 + size.lg,
  },
  chips: { gap: size.sm },
  patinha: {
    width: 26,
    height: 26,
    borderRadius: size.radiusPill,
    backgroundColor: colors.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
});