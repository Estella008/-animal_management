import { Platform } from 'react-native';
import Constants from 'expo-constants';


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


export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data =
    response.status === 204
      ? null
      : await response.json().catch(() => null);

  if (!response.ok) {
    console.log('Status HTTP:', response.status);
    console.log('Resposta do backend:', JSON.stringify(data, null, 2));

    throw new ApiError(response.status, data);
  }

  return data as T;
}
/** Atalhos para os métodos mais usados. */
export const api = {
  get: <T>(path: string) => apiFetch<T>(path),

  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  postForm: <T>(path: string, body: FormData) =>
    apiFetch<T>(path, {
      method: 'POST',
      body,
    }),

  patchForm: <T>(path: string, body: FormData) =>
    apiFetch<T>(path, {
    method: 'PATCH',
    body,
  }),

  put: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
    
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) =>
    apiFetch<T>(path, {
      method: 'DELETE',
    }),
};
function getApiUrl(): string {
  // Se você definir manualmente (ex: produção), ela tem prioridade
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Em desenvolvimento: pega o IP do computador que está rodando o Expo
  const host = Constants.expoConfig?.hostUri?.split(':')[0];

  if (host) {
    return `http://${host}:8000`;
  }


  return 'http://10.0.2.2:8000';
}

export const API_URL = getApiUrl();