import { api } from '@/services/api';
import type { TipoEvento } from '@/constants/tipos-cuidado';
import type { VacinaParaAgenda } from '@/utils/agenda';

export type StatusEvento = 'agendado' | 'realizado' | 'cancelado';

/** Um evento como a API devolve (igual ao EventoSerializer do backend). */
export type Evento = {
  id: number;
  animal: number;
  tipo: TipoEvento;
  status: StatusEvento;
  titulo: string;
  data: string; // 'AAAA-MM-DD'
  hora: string | null; // 'HH:MM:SS'
  local: string;
  profissional: string;
  observacoes: string;
  lembrete_dias_antes: number;
  criado_em: string;
};

/**
 * O que o app envia para cadastrar um evento.
 * Obrigatórios: animal, tipo, titulo e data. O resto é opcional.
 */
export type NovoEvento = Pick<Evento, 'animal' | 'tipo' | 'titulo' | 'data'> &
   Partial<Pick<Evento, 'status' | 'hora' | 'local' | 'profissional' | 'observacoes' | 'lembrete_dias_antes'>>;
type FiltrosEvento = {
  animal?: number;
  status?: StatusEvento;
};

// Lista os eventos dos animais da tutora logada.
// Ex.: listarEventos({ status: 'agendado' }) -> GET /agenda/eventos/?status=agendado
export function listarEventos(filtros: FiltrosEvento = {}) {
  const params = new URLSearchParams();
  if (filtros.animal) params.append('animal', String(filtros.animal));
  if (filtros.status) params.append('status', filtros.status);

  const query = params.toString();
  return api.get<Evento[]>(`/agenda/eventos/${query ? `?${query}` : ''}`);
}

// Lista TODAS as vacinas dos pets da tutora logada (sem filtrar por pet).
// A agenda precisa delas para mostrar as próximas doses e o histórico.
// (O services/vacinas.ts da branch cadastroVacinas busca por um pet só.)
export function listarVacinasDaAgenda() {
  return api.get<VacinaParaAgenda[]>('/agenda/vacinas/');
}

// Cadastra um evento novo
export function cadastrarEvento(dados: NovoEvento) {
  return api.post<Evento>('/agenda/eventos/', dados);
}