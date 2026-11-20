import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FormField } from '@/components/ui/form-field';
import { colors, fonts, size } from '@/constants/theme';
import { ORDEM_TIPOS, TIPOS_CUIDADO, type TipoCuidado } from '@/constants/tipos-cuidado';

type Props = {
  valor: TipoCuidado | null;
  onChange: (tipo: TipoCuidado) => void;
};

/**
 * Grade com os tipos de cuidado (Vacina, Consulta, Exame...).
 * Os tipos, ícones e nomes vêm de constants/tipos-cuidado.ts:
 * se um tipo novo for criado lá, ele aparece aqui sozinho.
 */
export function TipoCuidadoPicker({ valor, onChange }: Props) {
  return (
    <FormField label="Que tipo de cuidado?">
      <View accessibilityRole="radiogroup" style={styles.grade}>
        {ORDEM_TIPOS.map((tipo) => {
          const info = TIPOS_CUIDADO[tipo];
          const selecionado = valor === tipo;
          return (
            <Pressable
              key={tipo}
              accessibilityRole="radio"
              accessibilityState={{ selected: selecionado }}
              accessibilityLabel={info.label}
              onPress={() => onChange(tipo)}
              style={({ pressed }) => [
                styles.opcao,
                selecionado && styles.opcaoSelecionada,
                pressed && !selecionado && styles.pressed,
              ]}>
              <MaterialCommunityIcons
                name={info.icone}
                size={22}
                color={selecionado ? colors.primaryDark : colors.text}
              />
              <ThemedText style={[styles.texto, selecionado && styles.textoSelecionado]} numberOfLines={1}>
                {info.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  // 3 por linha: flexWrap quebra a linha e cada opção ocupa ~1/3
  // (31.5% x 3 + os 2 espaços de 8px cabem em 100%)
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: size.sm },
  opcao: {
    width: '31.5%',
    height: 72,
    borderRadius: size.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: size.xs + 2,
    paddingHorizontal: size.xs,
  },
  opcaoSelecionada: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.backgroundSelected,
  },
  pressed: { backgroundColor: colors.backgroundSelected },
  texto: { fontSize: 13, fontWeight: fonts.medium, color: colors.text },
  textoSelecionado: { color: colors.primaryDark, fontWeight: fonts.bold },
});