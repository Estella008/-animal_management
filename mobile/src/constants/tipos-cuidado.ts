import type { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Tipos de cuidado que aparecem na agenda.
 *
 * - "vacina" vem do model VacinaAplicada (tem doses e reforço).
 * - Os outros vêm do model Evento (cuidados pontuais).
 *
 * Os valores ('banho_tosa', 'outro'...) precisam ser IGUAIS aos do backend
 * (agenda/models.py), senão a API recusa.
 */
export type TipoCuidado = 'vacina' | 'consulta' | 'exame' | 'banho_tosa' | 'outro';

/** Só os tipos que são salvos como Evento (tudo menos vacina). */
export type TipoEvento = Exclude<TipoCuidado, 'vacina'>;

type NomeIcone = keyof typeof MaterialCommunityIcons.glyphMap;

type InfoTipo = {
  label: string;
  icone: NomeIcone; // ícone do MaterialCommunityIcons
  cor: string; // usada nos pontinhos do calendário e na legenda
};

export const TIPOS_CUIDADO: Record<TipoCuidado, InfoTipo> = {
  vacina: { label: 'Vacina', icone: 'needle', cor: '#087F70' },
  consulta: { label: 'Consulta', icone: 'stethoscope', cor: '#3B5BDB' },
  exame: { label: 'Exame', icone: 'flask-outline', cor: '#8E44AD' },
  banho_tosa: { label: 'Banho e tosa', icone: 'content-cut', cor: '#E07B1F' },
  outro: { label: 'Outro', icone: 'dots-horizontal', cor: '#8A8F8E' },
};

/** Ordem em que os tipos aparecem na tela de Novo cuidado e na legenda. */
export const ORDEM_TIPOS: TipoCuidado[] = ['vacina', 'consulta', 'exame', 'banho_tosa', 'outro'];