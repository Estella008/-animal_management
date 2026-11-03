import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UserAvatar } from '@/components/ui/user-avatar';
import { fonts, size } from '@/constants/theme';
import { obterSaudacao, primeiroNome } from '@/utils/usuario';

type Props = {
  nome: string;
  onAvatarPress: () => void;
};

export function HomeHeader({ nome, onAvatarPress }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <ThemedText type="small" themeColor="textSecondary">
          {obterSaudacao()}
        </ThemedText>
        <ThemedText type="title" numberOfLines={1} style={styles.name}>
          {primeiroNome(nome) || ' '}
        </ThemedText>
      </View>

      <UserAvatar nome={nome} onPress={onAvatarPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: size.md },
  texts: { flex: 1 },
  name: { fontWeight: fonts.bold },
});
