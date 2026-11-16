import { AdminUser, AuthTokens } from '../types/auth';

const ACCESS_TOKEN_KEY = 'gotails_admin_access_token';
const REFRESH_TOKEN_KEY = 'gotails_admin_refresh_token';
const USER_KEY = 'gotails_admin_user';

export const tokenStorage = {
  getAccessToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getUser(): AdminUser | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? (JSON.parse(data) as AdminUser) : null;
    } catch {
      return null;
    }
  },

  setAuth(tokens: AuthTokens, user?: AdminUser): void {
    try {
      if (tokens.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      }
      if (tokens.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      }
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.error('[tokenStorage] Failed to save auth data', e);
    }
  },

  setUser(user: AdminUser): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('[tokenStorage] Failed to save user data', e);
    }
  },

  clearAuth(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('[tokenStorage] Failed to clear auth data', e);
    }
  },
};
