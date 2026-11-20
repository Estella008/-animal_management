import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/icon-button';
import { fonts, size } from '@/constants/theme';

type Props = {
  titulo: string;
  subtitulo?: string;
  /** Se passar, aparece a setinha de voltar à esquerda. */
  onVoltar?: () => void;
  /** Algo para o canto direito, normalmente um IconButton. */
  direita?: ReactNode;
};

/**
 * Cabeçalho das telas.
 * - Agenda: <ScreenHeader titulo="Agenda" subtitulo="..." direita={<IconButton .../>} />
 * - Novo cuidado: <ScreenHeader titulo="Novo cuidado" onVoltar={router.back} />
 */
export function ScreenHeader({ titulo, subtitulo, onVoltar, direita }: Props) {
  // Com botão de voltar, o título fica menor (padrão de tela interna)
  const telaInterna = Boolean(onVoltar);

  return (
    <View style={styles.row}>
      {onVoltar ? (
        <IconButton
          icone="chevron-back"
          accessibilityLabel="Voltar"
          variante="simples"
          onPress={onVoltar}
        />
      ) : null}

      <View style={styles.texts}>
        <ThemedText
          type={telaInterna ? 'subtitle' : 'title'}
          numberOfLines={1}
          accessibilityRole="header"
          style={styles.titulo}>
          {titulo}
        </ThemedText>
        {subtitulo ? (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {subtitulo}
          </ThemedText>
        ) : null}
      </View>

      {direita}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: size.sm },
  texts: { flex: 1 },
  titulo: { fontWeight: fonts.bold },
});