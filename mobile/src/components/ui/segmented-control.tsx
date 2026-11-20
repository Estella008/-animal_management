import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { colors, fonts, size } from '@/constants/theme';

type Opcao<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  opcoes: Opcao<T>[];
  valor: T;
  onChange: (valor: T) => void;
};

/**
 * Abas lado a lado, uma sempre selecionada. Ex.: Próximos | Histórico.
 *
 * O <T extends string> é um "tipo genérico": quem usa diz quais valores
 * existem (ex.: 'proximos' | 'historico') e o TypeScript avisa se
 * alguém escrever um valor errado.
 */
export function SegmentedControl<T extends string>({ opcoes, valor, onChange }: Props<T>) {
  return (
    <View accessibilityRole="tablist" style={styles.trilho}>
      {opcoes.map((opcao) => {
        const ativa = opcao.value === valor;
        return (
          <Pressable
            key={opcao.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativa }}
            onPress={() => onChange(opcao.value)}
            style={[styles.aba, ativa && styles.abaAtiva]}>
            <ThemedText style={[styles.texto, ativa && styles.textoAtivo]}>{opcao.label}</ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  trilho: {
    flexDirection: 'row',
    gap: size.xs,
    padding: size.xs,
    borderRadius: size.radiusMd,
    backgroundColor: colors.divider,
  },
  aba: {
    flex: 1,
    height: 36,
    borderRadius: size.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  abaAtiva: {
    backgroundColor: colors.surface,
    // sombra leve (iOS usa shadow*, Android usa elevation)
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  texto: { fontSize: size.textSm, fontWeight: fonts.medium, color: colors.textSecondary },
  textoAtivo: { color: colors.text, fontWeight: fonts.semibold },
});