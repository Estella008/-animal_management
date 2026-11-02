import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function Navegacao() {
  const { token, carregando } = useAuth();

  if (carregando) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Telas que exigem login */}
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="index" />
        <Stack.Screen name="cadastro-usuario" />
        <Stack.Screen name="cadastro-pet" />
      </Stack.Protected>

      {/* Telas só para quem NÃO está logada */}
      <Stack.Protected guard={!token}>
        <Stack.Screen name="login" />
        
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Navegacao />
    </AuthProvider>
  );
}