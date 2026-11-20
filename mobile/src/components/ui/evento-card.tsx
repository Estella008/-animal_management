import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { colors, fonts, size } from '@/constants/theme';
import { TIPOS_CUIDADO } from '@/constants/tipos-cuidado';
import { dataCurta, partesDaData, type ItemAgenda } from '@/utils/agenda';

type Props = {
  item: ItemAgenda;
  /** Nome do pet. O item só tem o id do animal, então a tela passa o nome. */
  nomePet?: string;
  onPress?: () => void;
};

/**
 * Card de um cuidado na agenda (evento ou vacina, tanto faz:
 * os dois chegam aqui no formato ItemAgenda).
 *
 *  [18 ]  ✂ Banho e tosa · Thor
 *  [QUA]  Banho mensal                    >
 *         10:00 · Pet shop do bairro
 */
export function EventoCard({ item, nomePet, onPress }: Props) {
  const tipo = TIPOS_CUIDADO[item.tipo];
  const { dia, semana } = partesDaData(item.data);
  const linhaTipo = nomePet ? `${tipo.label} · ${nomePet}` : tipo.label;

  // Frase que o leitor de tela fala ao focar o card inteiro
  const descricao = [linhaTipo, item.titulo, dataCurta(item.data), item.detalhe]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={descricao}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.data}>
        <ThemedText style={styles.dia}>{dia}</ThemedText>
        <ThemedText style={styles.semana}>{semana}</ThemedText>
      </View>

      <View style={styles.textos}>
        <View style={styles.linhaTipo}>
          <MaterialCommunityIcons name={tipo.icone} size={14} color={colors.primary} />
          <ThemedText style={styles.tipo} numberOfLines={1}>
            {linhaTipo}
          </ThemedText>
        </View>
        <ThemedText style={styles.titulo} numberOfLines={1}>
          {item.titulo}
        </ThemedText>
        {item.detalhe ? (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {item.detalhe}
          </ThemedText>
        ) : null}
      </View>

      {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.placeholder} /> : null}
    </Pressable>
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
  pressed: { backgroundColor: colors.backgroundSelected },
  data: {
    width: 44,
    paddingVertical: size.xs,
    borderRadius: size.radiusSm + 2,
    backgroundColor: colors.backgroundSelected,
    alignItems: 'center',
  },
  dia: { fontSize: size.textLg, lineHeight: 22, fontWeight: fonts.bold, color: colors.primaryDark },
  semana: { fontSize: 11, lineHeight: 14, fontWeight: fonts.semibold, color: colors.primaryDark },
  textos: { flex: 1, minWidth: 0 },
  linhaTipo: { flexDirection: 'row', alignItems: 'center', gap: size.xs + 2 },
  tipo: { flexShrink: 1, fontSize: size.textXs, lineHeight: 16, fontWeight: fonts.semibold, color: colors.primary },
  titulo: { fontSize: size.textMd, lineHeight: 22, fontWeight: fonts.bold },
});