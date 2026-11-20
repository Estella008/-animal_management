
import { api } from '@/services/api';

export type FrequenciaVacina =
  | 'unica'
  | 'anual'
  | 'serie_unica'
  | 'serie_anual'
  | 'personalizada';

export type VacinaAplicada = {
  id: number;
  animal: number;
  nome: string;
  laboratorio: string;
  data_aplicacao: string;
  frequencia: FrequenciaVacina;
  numero_dose: number;
  total_doses: number | null;
  intervalo_doses_dias: number | null;
  intervalo_reforco_meses: number | null;
  proxima_dose: string | null;
  observacoes: string;
};

export type NovaVacina = Omit<VacinaAplicada, 'id'>;

// Busca as vacinas registradas de um pet
export function listarVacinas(animalId: number) {
  return api.get<VacinaAplicada[]>(
    `/agenda/vacinas/?animal=${animalId}`
  );
}

// Cadastra uma vacina para um pet
export function cadastrarVacina(dados: NovaVacina) {
  return api.post<VacinaAplicada>(
    '/agenda/vacinas/',
    dados
  );
}
