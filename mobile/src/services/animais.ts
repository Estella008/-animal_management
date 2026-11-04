import { api } from '@/services/api';

export type Animal = {
  id: number;
  nome: string;
  especie: 'cachorro' | 'gato';
  raca: string;
  data_nascimento: string | null;
  sexo: 'macho' | 'femea';
  castrado: boolean;
  porte: 'pequeno' | 'medio' | 'grande';
  peso: string | number | null;
  foto: string | null;
  observacoes: string;
};

// Lista os animais do usuário logado
export function listarAnimais() {
  return api.get<Animal[]>('/animais/');
}

// Busca as informações de um animal específico
export function buscarAnimal(id: number) {
  return api.get<Animal>(`/animais/${id}/`);
}

// Atualiza os dados de um animal já cadastrado
export function atualizarAnimal(id: number, dados: FormData) {
  return api.patchForm<Animal>(`/animais/${id}/`, dados);
}