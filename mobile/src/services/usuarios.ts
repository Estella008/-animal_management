import { api } from '@/services/api';

export type Usuario = {
  id: number;
  nome: string;
  email: string;
};

// Quem é o usuário dono do token enviado na requisição
export function buscarUsuarioLogado() {
  return api.get<Usuario>('/usuarios/me/');
}
