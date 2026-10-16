import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { colors } from '@/constants/theme';

export default function Index() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <Pressable
        style={styles.card}
        onPress={() => router.push('/cadastro-pet')}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="paw" size={36} color="#FFFFFF" />
          <View style={styles.plus}>
            <Ionicons name="add" size={16} color="#087F70" />
          </View>
        </View>

        <ThemedText type="subtitle">
          Cadastrar animal
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: 170,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: colors.backgroundElement,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});