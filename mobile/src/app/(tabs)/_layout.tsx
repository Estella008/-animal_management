import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { BottomNav } from '@/components/ui/bottom-nav';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cadastro-pet"
        options={{
          title: 'Cadastro de animais',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'happy' : 'happy-outline'}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
    </Tabs>
  );
}