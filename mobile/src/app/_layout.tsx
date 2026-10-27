import { Stack } from 'expo-router';

export default function RootLayout() {
  return (<Stack>
    <Stack.Screen name="index" />
    <Stack.Screen name="cadastro-pet" />
    <Stack.Screen name="login" />
  </Stack>);
}