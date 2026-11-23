import { ApiResponse } from '../types/auth';
import { tokenStorage } from '../utils/tokenStorage';

export const API_CONFIG = {
  BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL || 'https://quickecom.gotails.in/api/v1',
  TIMEOUT: 20000,
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export function getApiErrorMessage(response: ApiResponse<any>, fallback = 'An unexpected error occurred'): string {
  if (response.error && typeof response.error === 'object') {
    const errObj = response.error as any;
    if (Array.isArray(errObj.details) && errObj.details.length > 0) {
      const detailsMsg = errObj.details
        .map((d: any) => (typeof d === 'string' ? d : d.message || JSON.stringify(d)))
        .join('; ');
      if (detailsMsg) return detailsMsg;
    }
    if (errObj.message) {
      if (errObj.message === 'An unexpected error occurred' && response.statusCode === 500) {
        return 'Server database error (HTTP 500): The production backend rejected saving this record, likely due to missing required schema fields on legacy data.';
      }
      return errObj.message;
    }
  }
  if (typeof response.error === 'string' && response.error) return response.error;
  if (response.message) return response.message;
  return fallback;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Callback invoked when refresh token fails permanently
let onAuthExpiredCallback: (() => void) | null = null;

export function setOnAuthExpired(callback: () => void) {
  onAuthExpiredCallback = callback;
}

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Attempts to silently refresh the access token using the stored refresh token.
 */
async function refreshAccessToken(): Promise<string | null> {
  const currentRefreshToken = tokenStorage.getRefreshToken();
  if (!currentRefreshToken) {
    return null;
  }

  try {
    const refreshUrl = `${API_CONFIG.BASE_URL}/auth/token/refresh`;
    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({
        refreshToken: currentRefreshToken,
        deviceInfo: navigator.userAgent ? navigator.userAgent.substring(0, 100) : 'Admin Panel Web',
      }),
    });

    const json = (await response.json()) as ApiResponse<any>;
    const tokens = json.data?.tokens || json.data;

    if (response.ok && json.success && tokens?.accessToken) {
      const newAccess = tokens.accessToken;
      const newRefresh = tokens.refreshToken || currentRefreshToken;
      tokenStorage.setAuth({
        accessToken: newAccess,
        refreshToken: newRefresh,
      });
      return newAccess;
    } else {
      tokenStorage.clearAuth();
      if (onAuthExpiredCallback) onAuthExpiredCallback();
      return null;
    }
  } catch (err) {
    console.warn('[apiClient] Refresh token network error', err);
    tokenStorage.clearAuth();
    if (onAuthExpiredCallback) onAuthExpiredCallback();
    return null;
  }
}

/**
 * Centralized HTTP Client
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = tokenStorage.getAccessToken();
  const headers: Record<string, string> = {
    ...API_CONFIG.HEADERS,
    ...(options.headers as Record<string, string>),
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // If 401 Unauthorized and not an auth endpoint, attempt automatic token refresh
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/token/refresh')) {
      if (isRefreshing) {
        return new Promise<ApiResponse<T>>((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              apiClient<T>(endpoint, options).then(resolve).catch(reject);
            },
            reject: () => {
              resolve({
                success: false,
                statusCode: 401,
                error: 'Session expired. Please log in again.',
              });
            },
          });
        });
      }

      isRefreshing = true;
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          processQueue(null, newAccessToken);
          headers['Authorization'] = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          const retryJson = (await retryResponse.json()) as ApiResponse<T>;
          return {
            success: retryResponse.ok && (retryJson.success ?? true),
            statusCode: retryResponse.status,
            message: retryJson.message,
            data: retryJson.data,
            error: retryJson.error,
          };
        } else {
          processQueue(new Error('Token refresh failed'));
          return {
            success: false,
            statusCode: 401,
            error: 'Session expired. Please log in again.',
          };
        }
      } finally {
        isRefreshing = false;
      }
    }

    let json: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      json = await response.json();
    } else {
      const text = await response.text();
      json = { message: text };
    }

    return {
      success: response.ok && (json.success ?? true),
      statusCode: response.status,
      message: json.message,
      data: json.data,
      error: json.error || (!response.ok ? json.message || response.statusText : undefined),
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        statusCode: 408,
        error: 'Request timed out. Please check your internet connection and try again.',
      };
    }
    return {
      success: false,
      statusCode: 0,
      error: err.message || 'Network error. Please check your connection.',
    };
  }
}
