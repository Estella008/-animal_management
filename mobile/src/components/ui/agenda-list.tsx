import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { EventoCard } from '@/components/ui/evento-card';
import { NoticeCard } from '@/components/ui/notice-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { colors, fonts, size } from '@/constants/theme';
import { TIPOS_CUIDADO } from '@/constants/tipos-cuidado';
import {
  dataCurta,
  diasDeAtraso,
  type GrupoAgenda,
  type ItemAgenda,
} from '@/utils/agenda';

type Props = {
  grupos: GrupoAgenda[];
  /** Itens atrasados, mostrados em vermelho no topo. Só na aba Próximos. */
  atrasados?: ItemAgenda[];
  /** { 3: 'Thor', 5: 'Mia' } -> para mostrar o nome do pet em cada card. */
  nomesPets: Record<number, string>;
  carregando: boolean;
  erro: boolean;
  onTentarNovamente: () => void;
  onSelecionar: (item: ItemAgenda) => void;
  /** Botão do card de atrasado ("Já foi aplicada" / "Já foi feito"). */
  onResolverAtrasado?: (item: ItemAgenda) => void;
  /** Texto quando não há nada. Muda conforme a aba. */
  mensagemVazia: string;
  /** Se passar, mostra um botão no estado vazio (ex.: cadastrar cuidado). */
  vazio?: { titulo: string; onPress: () => void };
};

/**
 * Lista da agenda: atrasados no topo e depois os grupos
 * ("Esta semana", "Dezembro"...). Também cuida dos estados de
 * carregando, erro e lista vazia, igual ao PetList.
 */
export function AgendaList({
  grupos,
  atrasados = [],
  nomesPets,
  carregando,
  erro,
  onTentarNovamente,
  onSelecionar,
  onResolverAtrasado,
  mensagemVazia,
  vazio,
}: Props) {
  const nadaNaTela = grupos.length === 0 && atrasados.length === 0;

  // Só mostra o carregamento quando ainda não há nada na tela.
  // Assim, a lista não pisca ao voltar de outra tela.
  if (carregando && nadaNaTela) {
    return <ActivityIndicator color={colors.primary} style={styles.loading} />;
  }

  if (erro) {
    return (
      <View style={styles.message}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          Não foi possível carregar a agenda.
        </ThemedText>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onTentarNovamente}>
          <ThemedText type="linkPrimary">Tentar novamente</ThemedText>
        </Pressable>
      </View>
    );
  }

  if (nadaNaTela) {
    return (
      <View style={styles.message}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          {mensagemVazia}
        </ThemedText>
        {vazio ? <PrimaryButton title={vazio.titulo} onPress={vazio.onPress} style={styles.button} /> : null}
      </View>
    );
  }

  return (
    <View style={styles.lista}>
      {atrasados.length > 0 ? (
        <View style={styles.grupo}>
          <ThemedText accessibilityRole="header" style={[styles.tituloGrupo, styles.tituloAtrasado]}>
            Atrasado
          </ThemedText>
          {atrasados.map((item) => {
            const tipo = TIPOS_CUIDADO[item.tipo];
            const pet = nomesPets[item.animal];
            const dias = diasDeAtraso(item);
            return (
              <NoticeCard
                key={item.chave}
                title={item.titulo}
                message={`${tipo.label}${pet ? ` · ${pet}` : ''} · era para ${dataCurta(item.data)} (${dias} ${dias === 1 ? 'dia' : 'dias'} de atraso)`}
                actionLabel={
                  onResolverAtrasado
                    ? item.tipo === 'vacina' ? 'Já foi aplicada' : 'Já foi feito'
                    : undefined
                }
                onAction={onResolverAtrasado ? () => onResolverAtrasado(item) : undefined}
              />
            );
          })}
        </View>
      ) : null}

      {grupos.map((grupo) => (
        <View key={grupo.titulo} style={styles.grupo}>
          <ThemedText accessibilityRole="header" style={styles.tituloGrupo}>
            {grupo.titulo}
          </ThemedText>
          {grupo.itens.map((item) => (
            <EventoCard
              key={item.chave}
              item={item}
              nomePet={nomesPets[item.animal]}
              onPress={() => onSelecionar(item)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: size.xxl },
  lista: { gap: size.xl },
  grupo: { gap: size.sm },
  tituloGrupo: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fonts.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  tituloAtrasado: { color: colors.danger },
  message: { alignItems: 'center', gap: size.md, paddingVertical: size.xxl },
  center: { textAlign: 'center' },
  button: { alignSelf: 'stretch' },
});