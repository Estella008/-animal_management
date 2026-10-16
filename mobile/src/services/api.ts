import { Platform } from 'react-native';

/**
 * Endereço base da API Django.
 *
 * Ordem de prioridade:
 * 1. Variável de ambiente EXPO_PUBLIC_API_URL (arquivo mobile/.env)
 *    -> use isso no celular físico, com o IP do seu computador.
 * 2. Valor padrão por plataforma (emuladores/simuladores).
 */
const DEFAULT_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api', // emulador Android enxerga o PC por 10.0.2.2
  default: 'http://localhost:8000/api', // iOS simulator e web
});

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_URL;

/** Erro com o status HTTP e o corpo da resposta, para as telas tratarem. */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super(`Erro ${status} na API`);
    this.status = status;
    this.data = data;
  }
}

// Token de autenticação (será preenchido quando fizermos o login, RF02).
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

/**
 * Função base para falar com o backend.
 * Exemplo: apiFetch('/usuarios/', { method: 'POST', body: JSON.stringify({...}) })
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  });

  // Algumas respostas (ex.: DELETE) vêm sem corpo.
  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
}

/** Atalhos para os métodos mais usados. */
export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};