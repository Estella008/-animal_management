import { api } from '@/services/api';

export type TipoOpcao = 'raca' | 'vacina' | 'laboratorio';

export type Opcao = {
  id: number;
  tipo: TipoOpcao;
  especie: string;
  nome: string;
  personalizada: boolean; 
};


export function listarOpcoes(tipo: TipoOpcao, especie?: string) {
  const params = new URLSearchParams({ tipo });
  if (especie) params.append('especie', especie);
  return api.get(`/opcoes/?${params.toString()}`) as Promise<Opcao[]>;
}


export function adicionarOpcao(tipo: TipoOpcao, nome: string, especie?: string) {
  return api.post('/opcoes/', { tipo, nome, especie: especie ?? '' }) as Promise<Opcao>;
}