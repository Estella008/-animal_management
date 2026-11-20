import type { TipoCuidado } from '@/constants/tipos-cuidado';
import type { Evento } from '@/services/agenda';


export type ItemAgenda = {
  chave: string; // única na lista: 'evento-3', 'vacina-5'...
  origem: 'evento' | 'vacina';
  id: number;
  animal: number;
  tipo: TipoCuidado;
  titulo: string;
  data: string; // 'AAAA-MM-DD'
  hora: string | null; // 'HH:MM'
  detalhe: string; // linha cinza do card
  status: 'agendado' | 'realizado';
};

export type GrupoAgenda = {
  titulo: string;
  itens: ItemAgenda[];
};


export type VacinaParaAgenda = {
  id: number;
  animal: number;
  nome: string;
  data_aplicacao: string;
  numero_dose: number;
  total_doses: number | null;
  proxima_dose: string | null;
};

// ---------- Datas ----------

/**
 * Transforma 'AAAA-MM-DD' em Date no horário LOCAL.
 *
 * Cuidado: new Date('2026-11-18') entende a data como meia-noite em UTC.
 * No Brasil (UTC-3) isso vira 17/11 às 21h, ou seja, UM DIA ANTES.
 * Por isso montamos a data "na mão".
 */
export function lerData(data: string): Date {
  const [ano, mes, dia] = data.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

/** Date -> 'AAAA-MM-DD' (no horário local). */
export function paraISO(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function hojeISO(): string {
  return paraISO(new Date());
}
/**
 * '21/11/2026' -> '2026-11-21'. Devolve null se a data não existir
 * (ex.: 31/02/2026 ou 15/13/2026), não só se o formato estiver errado.
 */
export function dataBRparaISO(texto: string): string | null {
  const partes = texto.split('/');
  if (partes.length !== 3 || partes[2].length !== 4) return null;
  const [dia, mes, ano] = partes.map(Number);
  const data = new Date(ano, mes - 1, dia);
  // Se o dia não existe, o JavaScript "pula" para o mês seguinte
  // (31/02 vira 03/03). Comparando de volta, descobrimos isso.
  const existe = data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
  return existe ? paraISO(data) : null;
}

/** '14:30' é válida; '25:00', '14:7' e '1430' não. */
export function horaValida(texto: string): boolean {
  const certo = /^\d{2}:\d{2}$/.test(texto);
  if (!certo) return false;
  const [h, m] = texto.split(':').map(Number);
  return h <= 23 && m <= 59;
}
/** Diferença em dias entre duas datas 'AAAA-MM-DD' (b - a). */
function diasEntre(a: string, b: string): number {
  const umDia = 24 * 60 * 60 * 1000;
  return Math.round((lerData(b).getTime() - lerData(a).getTime()) / umDia);
}

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];
const SEMANA_CURTA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

function maiuscula(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Para o bloquinho de data do card: { dia: '18', semana: 'QUA' }. */
export function partesDaData(data: string) {
  const d = lerData(data);
  return { dia: String(d.getDate()).padStart(2, '0'), semana: SEMANA_CURTA[d.getDay()] };
}

/** '2026-11-12' -> '12 nov' */
export function dataCurta(data: string): string {
  const d = lerData(data);
  return `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`;
}

// ---------- Conversões para ItemAgenda ----------

export function eventoParaItem(evento: Evento): ItemAgenda {
  const hora = evento.hora ? evento.hora.slice(0, 5) : null; // '14:30:00' -> '14:30'
  const detalhe = [hora, evento.profissional || evento.local].filter(Boolean).join(' · ');

  return {
    chave: `evento-${evento.id}`,
    origem: 'evento',
    id: evento.id,
    animal: evento.animal,
    tipo: evento.tipo,
    titulo: evento.titulo,
    data: evento.data,
    hora,
    detalhe,
    // 'cancelado' não chega aqui: a tela só busca agendados e realizados
    status: evento.status === 'realizado' ? 'realizado' : 'agendado',
  };
}


export function vacinasParaItens(vacinas: VacinaParaAgenda[]) {
  const aplicadas: ItemAgenda[] = vacinas.map((v) => ({
    chave: `vacina-${v.id}`,
    origem: 'vacina',
    id: v.id,
    animal: v.animal,
    tipo: 'vacina',
    titulo: v.nome,
    data: v.data_aplicacao,
    hora: null,
    detalhe: v.total_doses && v.total_doses > 1 ? `Dose ${v.numero_dose} de ${v.total_doses}` : 'Aplicada',
    status: 'realizado',
  }));

  // Guarda só a aplicação mais recente de cada (pet + nome da vacina)
  const maisRecente = new Map<string, VacinaParaAgenda>();
  for (const v of vacinas) {
    const chave = `${v.animal}-${v.nome.trim().toLowerCase()}`;
    const atual = maisRecente.get(chave);
    if (!atual || v.data_aplicacao > atual.data_aplicacao) maisRecente.set(chave, v);
  }

  const proximas: ItemAgenda[] = [];
  for (const v of maisRecente.values()) {
    if (!v.proxima_dose) continue;
    const temMaisDoses = v.total_doses !== null && v.numero_dose < v.total_doses;
    proximas.push({
      chave: `vacina-proxima-${v.id}`,
      origem: 'vacina',
      id: v.id,
      animal: v.animal,
      tipo: 'vacina',
      titulo: v.nome,
      data: v.proxima_dose,
      hora: null,
      detalhe: temMaisDoses ? `Dose ${v.numero_dose + 1} de ${v.total_doses}` : 'Reforço',
      status: 'agendado',
    });
  }

  return { aplicadas, proximas };
}

// ---------- Regras da agenda ----------

/** Agendado com data antes de hoje. Comparar 'AAAA-MM-DD' como texto funciona! */
export function estaAtrasado(item: ItemAgenda, hoje = hojeISO()): boolean {
  return item.status === 'agendado' && item.data < hoje;
}

export function diasDeAtraso(item: ItemAgenda, hoje = hojeISO()): number {
  return Math.max(0, diasEntre(item.data, hoje));
}

/** Ordena por data e hora (sem hora vai primeiro no dia). */
function ordenar(itens: ItemAgenda[], decrescente = false) {
  const copia = [...itens].sort((a, b) => {
    const chaveA = `${a.data} ${a.hora ?? ''}`;
    const chaveB = `${b.data} ${b.hora ?? ''}`;
    return chaveA.localeCompare(chaveB);
  });
  return decrescente ? copia.reverse() : copia;
}

/**
 * Separa os próximos cuidados em grupos para a aba "Próximos":
 * Hoje, Amanhã, Esta semana (até sábado) e depois um grupo por mês.
 * Os atrasados NÃO entram aqui: a tela mostra eles à parte, no topo.
 */
export function agruparProximos(itens: ItemAgenda[], hoje = hojeISO()): GrupoAgenda[] {
  const dataHoje = lerData(hoje);
  const diasAteSabado = 6 - dataHoje.getDay();

  const grupos: GrupoAgenda[] = [];
  const pegarGrupo = (titulo: string) => {
    let grupo = grupos.find((g) => g.titulo === titulo);
    if (!grupo) {
      grupo = { titulo, itens: [] };
      grupos.push(grupo);
    }
    return grupo;
  };

  for (const item of ordenar(itens)) {
    if (item.status !== 'agendado' || item.data < hoje) continue;

    const distancia = diasEntre(hoje, item.data);
    let titulo: string;
    if (distancia === 0) titulo = 'Hoje';
    else if (distancia === 1) titulo = 'Amanhã';
    else if (distancia <= diasAteSabado) titulo = 'Esta semana';
    else titulo = tituloDoMes(item.data, dataHoje.getFullYear());

    pegarGrupo(titulo).itens.push(item);
  }
  return grupos;
}

/** Aba "Histórico": realizados, do mais recente para o mais antigo, por mês. */
export function agruparHistorico(itens: ItemAgenda[], hoje = hojeISO()): GrupoAgenda[] {
  const anoAtual = lerData(hoje).getFullYear();
  const grupos: GrupoAgenda[] = [];

  for (const item of ordenar(itens, true)) {
    if (item.status !== 'realizado') continue;
    const titulo = tituloDoMes(item.data, anoAtual);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.titulo === titulo) ultimo.itens.push(item);
    else grupos.push({ titulo, itens: [item] });
  }
  return grupos;
}

/** 'Dezembro' (mesmo ano) ou 'Janeiro de 2027' (outro ano). */
function tituloDoMes(data: string, anoAtual: number): string {
  const d = lerData(data);
  const mes = maiuscula(MESES[d.getMonth()]);
  return d.getFullYear() === anoAtual ? mes : `${mes} de ${d.getFullYear()}`;
}