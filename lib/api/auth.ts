import { apiRequest } from '@/lib/api-client';
import { AuthTokens, AuthUser } from '@/lib/api-types';

export function login(username: string, password: string) {
  return apiRequest<{ tokens: AuthTokens; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: { username, password },
  });
}

export function logout() {
  return apiRequest<Record<string, never>>('/auth/logout', { method: 'POST' });
}

export function getProfile() {
  return apiRequest<AuthUser>('/auth/profile');
}
