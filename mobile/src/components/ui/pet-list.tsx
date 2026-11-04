import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PetCard } from '@/components/ui/pet-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { colors, size } from '@/constants/theme';
import type { Animal } from '@/services/animais';

type Props = {
  animais: Animal[];
  carregando: boolean;
  erro: boolean;
  onTentarNovamente: () => void;
  onCadastrar: () => void;
  onSelecionarAnimal: (id: number) => void;
};

export function PetList({ animais, carregando, erro, onTentarNovamente, onCadastrar, onSelecionarAnimal }: Props) {
  // Só mostra o carregamento quando ainda não há nada na tela.
  // Assim, a lista não pisca ao voltar de outra tela.
  if (carregando && animais.length === 0) {
    return <ActivityIndicator color={colors.primary} style={styles.loading} />;
  }

  if (erro) {
    return (
      <View style={styles.message}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          Não foi possível carregar seus dados.
        </ThemedText>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onTentarNovamente}>
          <ThemedText type="linkPrimary">Tentar novamente</ThemedText>
        </Pressable>
      </View>
    );
  }

  if (animais.length === 0) {
    return (
      <View style={styles.message}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          Você ainda não cadastrou nenhum animal.
        </ThemedText>
        <PrimaryButton title="Cadastrar animal" onPress={onCadastrar} style={styles.button} />
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {animais.map((animal) => (
        <PetCard 
          key={animal.id} 
          animal={animal} 
          onPress={() => onSelecionarAnimal(animal.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: size.xxl },
  list: { gap: size.md },
  message: { alignItems: 'center', gap: size.md, paddingVertical: size.xxl },
  center: { textAlign: 'center' },
  button: { alignSelf: 'stretch' },
});
