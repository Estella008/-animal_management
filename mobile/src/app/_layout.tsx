import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function Navegacao() {
  const { token, carregando } = useAuth();

  if (carregando) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Telas que exigem login */}
      <Stack.Protected guard={!!token}>        
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="pet/[id]" />
        <Stack.Screen name="usuario/perfil-usuario" />
        <Stack.Screen name="usuario/editar-conta" />
        <Stack.Screen name="cadastro-vacina" />
        <Stack.Screen name="agenda/novo-cuidado" />
      </Stack.Protected>

      {/* Telas só para quem NÃO está logada */}
      <Stack.Protected guard={!token}>
        <Stack.Screen name="login" />
        <Stack.Screen name="usuario/cadastro-usuario" />
        
        
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