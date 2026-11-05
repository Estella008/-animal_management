import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Animated, Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { UserAvatar } from '@/components/ui/user-avatar';
import { colors, size } from '@/constants/theme';



const LARGURA_MAXIMA = 300;
const DURACAO = 220;


type Props = {
  visible: boolean;
  nome: string;
  email: string;
  onClose: () => void;
  onEditarConta: () => void;
  onConfiguracoes: () => void;    
  onSair: () => void;
};

export function SideMenu({ visible, nome, email, onClose, onEditarConta, onConfiguracoes, onSair }: Props) {
  const { width } = useWindowDimensions();
  const largura = Math.min(LARGURA_MAXIMA, width * 0.82);

  // 0 = menu aberto; 1 = menu totalmente fora da tela, à direita
  const progresso = useRef(new Animated.Value(1)).current;

  // O Modal continua montado até a animação de fechar terminar
  const [montado, setMontado] = useState(visible);

  useEffect(() => {
    if (visible) setMontado(true);

    Animated.timing(progresso, {
      toValue: visible ? 0 : 1,
      duration: DURACAO,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) setMontado(false);
    });
  }, [visible, progresso]);

  const deslocamento = progresso.interpolate({ inputRange: [0, 1], outputRange: [0, largura] });
  const opacidadeFundo = progresso.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <Modal transparent visible={montado} animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { opacity: opacidadeFundo }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar menu"
            onPress={onClose}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Animated.View
          style={[styles.panel, { width: largura, transform: [{ translateX: deslocamento }] }]}>
          <SafeAreaView style={styles.safe}>
            <View style={styles.account}>
              <UserAvatar nome={nome} />
              <View style={styles.accountTexts}>
                <ThemedText type="smallBold" numberOfLines={1}>
                  {nome}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                  {email}
                </ThemedText>
              </View>
            </View>

            <MenuItem icon="person-outline" label="Editar conta" onPress={onEditarConta } />
            <MenuItem icon="settings-outline" label="Configurações" onPress={onConfiguracoes} />
            <MenuItem icon="log-out-outline" label="Sair" onPress={onSair} />
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

type MenuItemProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
};

function MenuItem({ icon, label, onPress }: MenuItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
      <Ionicons name={icon} size={22} color={colors.text} />
      <ThemedText style={styles.itemLabel}>{label}</ThemedText>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'flex-end' },
  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  panel: { flex: 1, backgroundColor: colors.surface },
  safe: { flex: 1, paddingHorizontal: size.lg, paddingTop: size.lg },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: size.md,
    paddingBottom: size.xl,
    marginBottom: size.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  accountTexts: { flex: 1 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: size.md,
    paddingVertical: size.md,
    paddingHorizontal: size.sm,
    borderRadius: size.radiusSm,
  },
  itemPressed: { backgroundColor: colors.backgroundSelected },
  itemLabel: { flex: 1 },
});
