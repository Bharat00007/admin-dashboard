import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';

export interface BackendGlobalSettings {
  key: string;
  universalSearchRadiusKm: number;
  globalDeliveryChargePaise: number;
  globalDeliveryChargeRupees: string;
  updatedBy?: string;
  updatedAt: string;
}

export interface UpdateSettingsPayload {
  universalSearchRadiusKm?: number;
  globalDeliveryChargePaise?: number;
}

export const settingsService = {
  /**
   * Get current platform settings
   * GET /api/v1/admin/settings
   */
  async getSettings(): Promise<ApiResponse<BackendGlobalSettings>> {
    return apiClient<BackendGlobalSettings>('/admin/settings');
  },

  /**
   * Update global platform settings
   * PATCH /api/v1/admin/settings
   */
  async updateSettings(payload: UpdateSettingsPayload): Promise<ApiResponse<BackendGlobalSettings>> {
    return apiClient<BackendGlobalSettings>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
