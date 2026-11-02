import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Icons } from '@/constants/icons';
import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Início</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={Icons.home.sf} md={Icons.home.md} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="animais">
        <NativeTabs.Trigger.Label>Cadastro de animais</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={Icons.pets.sf} md={Icons.pets.md} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="agenda">
        <NativeTabs.Trigger.Label>Agenda</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={Icons.calendar.sf} md={Icons.calendar.md} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}