import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';

export interface AdminAnalyticsOverview {
  totalGmvPaise: number;
  totalGmvRupees: string;
  totalOrdersCount: number;
  activeShopsCount: number;
  customerCount: number;
  orderStatusDistribution: {
    PLACED: number;
    ACCEPTED: number;
    PREPARING: number;
    COMPLETED: number;
    CANCELLED: number;
    REJECTED: number;
  };
}

export const analyticsService = {
  /**
   * Fetch system-wide administrative analytics overview
   */
  async getOverview(): Promise<ApiResponse<AdminAnalyticsOverview>> {
    return apiClient<AdminAnalyticsOverview>('/admin/analytics/overview');
  },
};
