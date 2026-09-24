import { User } from './types';

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql';

export async function graphqlRequest<T>(
  query: string,
  variables: Record<string, unknown> = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors) {
    throw new Error(payload.errors?.[0]?.message || 'Request failed');
  }

  return payload.data as T;
}

export function saveAuthToken(token: string) {
  localStorage.setItem('workspace_token', token);
}

export function getStoredUser(): User | null {
  const user = localStorage.getItem('workspace_user');
  return user ? JSON.parse(user) : null;
}

export function saveStoredUser(user: User) {
  localStorage.setItem('workspace_user', JSON.stringify(user));
}
