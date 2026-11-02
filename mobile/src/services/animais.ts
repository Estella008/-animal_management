import { api } from '@/services/api';

export type Animal = {
  id: number;
  nome: string;
  especie: 'cachorro' | 'gato';
  raca: string;
  foto: string | null;
};

// O backend já devolve apenas os animais do usuário logado
export function listarAnimais() {
  return api.get<Animal[]>('/animais/');
}
