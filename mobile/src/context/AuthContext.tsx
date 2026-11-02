import * as React from 'react';
import * as SecureStore from 'expo-secure-store';

import { setAuthToken } from '@/services/api';

// Formato do que o Context guarda
type AuthContextType = {
  token: string | null;
  carregando: boolean;
  entrar: (novoToken: string) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(null);
  const [carregando, setCarregando] = React.useState(true);


  React.useEffect(() => {
    SecureStore.getItemAsync('token').then((tokenSalvo) => {
      setAuthToken(tokenSalvo);
      setToken(tokenSalvo);
      setCarregando(false);
    });
  }, []);


  async function entrar(novoToken: string) {
    await SecureStore.setItemAsync('token', novoToken); 
    setAuthToken(novoToken);                            
    setToken(novoToken);                               
  }

  // Chamado pelo botão "Sair"
  async function sair() {
    await SecureStore.deleteItemAsync('token'); 
    setAuthToken(null);                         
    setToken(null);                             
  }

  return (
    <AuthContext.Provider value={{ token, carregando, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = React.useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth precisa ser usado dentro do AuthProvider');
  }
  return contexto;
}