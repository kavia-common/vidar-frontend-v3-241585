/**
 * Auth store
 *
 * Manages the OIDC JWT token lifecycle.
 * On login: call setAuthToken(token) from $lib/api/fetcher
 * On logout: call clearAuthToken() from $lib/api/fetcher
 *
 * Token is held in memory only — never persisted to localStorage.
 */

import { writable } from 'svelte/store';
import { setAuthToken, clearAuthToken } from '$lib/api/fetcher';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
}

const { subscribe, set, update } = writable<AuthState>({
  isAuthenticated: false,
  userId: null,
});

export const authStore = {
  subscribe,
  login(token: string, userId: string) {
    setAuthToken(token);
    set({ isAuthenticated: true, userId });
  },
  logout() {
    clearAuthToken();
    set({ isAuthenticated: false, userId: null });
  },
};
