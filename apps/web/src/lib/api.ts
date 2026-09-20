export const API_URL = 'http://localhost:8000';

const TOKEN_KEY = 'omninai_token';

export interface User {
  id: number;
  name: string;
  email: string;
  is_demo: boolean;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

interface ApiOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const detail = data?.detail || data?.message || `Request failed (${res.status})`;
    const message = typeof detail === 'string' ? detail : JSON.stringify(detail);
    throw new Error(message);
  }

  return data as T;
}

export async function signUp(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
  return apiRequest('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function signIn(email: string, password: string): Promise<{ token: string; user: User }> {
  return apiRequest('/api/v1/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signOutRequest(token: string): Promise<void> {
  await apiRequest('/api/v1/auth/signout', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function getMe(token: string): Promise<{ authenticated: boolean; user?: User }> {
  return apiRequest('/api/v1/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getDemo(): Promise<{ token: string; user: User }> {
  return apiRequest('/api/v1/auth/demo', { method: 'POST' });
}

export async function generateChat(prompt: string): Promise<{ response: string; model: string }> {
  return apiRequest('/api/v1/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
}