import { apiClient } from './apiClient';
import { ApiResponse, LoginResponseData, RefreshResponseData } from '../types/auth';

export const authService = {
  /**
   * Admin Login against POST /api/v1/auth/admin/login
   */
  async login(email: string, password: string): Promise<ApiResponse<LoginResponseData>> {
    const deviceInfo = typeof navigator !== 'undefined'
      ? `${navigator.platform || 'Web'} - ${navigator.userAgent.substring(0, 80)}`
      : 'GoTails Admin Panel';

    return apiClient<LoginResponseData>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
        deviceInfo,
      }),
    });
  },

  /**
   * Refresh token against POST /api/v1/auth/token/refresh
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<RefreshResponseData>> {
    const deviceInfo = typeof navigator !== 'undefined'
      ? `${navigator.platform || 'Web'} - ${navigator.userAgent.substring(0, 80)}`
      : 'GoTails Admin Panel';

    return apiClient<RefreshResponseData>('/auth/token/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refreshToken,
        deviceInfo,
      }),
    });
  },

  /**
   * Logout against POST /api/v1/auth/logout
   */
  async logout(refreshToken: string): Promise<ApiResponse<null>> {
    return apiClient<null>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({
        refreshToken,
      }),
    });
  },
};
