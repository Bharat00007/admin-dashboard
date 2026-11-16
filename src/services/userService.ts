import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';
import { PaginatedMeta } from './catalogService';

export interface BackendUser {
  _id: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  mobile: string;
  name?: string | null;
  email?: string | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  deactivatedAt?: string | null;
  tokenVersion?: number;
  referredByShopId?: any;
  referralCodeUsed?: string | null;
  referralAttributedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  shop?: any;
}

export const userService = {
  /**
   * List customers with pagination and search
   */
  async getCustomers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'ACTIVE' | 'SUSPENDED';
  } = {}): Promise<ApiResponse<BackendUser[]> & { meta?: PaginatedMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.search) query.set('search', params.search.trim());
    if (params.status) query.set('status', params.status);

    const qs = query.toString();
    const endpoint = `/admin/users/customers${qs ? `?${qs}` : ''}`;
    return apiClient<BackendUser[]>(endpoint);
  },

  /**
   * List sellers with pagination and search
   */
  async getSellers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'ACTIVE' | 'SUSPENDED';
  } = {}): Promise<ApiResponse<BackendUser[]> & { meta?: PaginatedMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.search) query.set('search', params.search.trim());
    if (params.status) query.set('status', params.status);

    const qs = query.toString();
    const endpoint = `/admin/users/sellers${qs ? `?${qs}` : ''}`;
    return apiClient<BackendUser[]>(endpoint);
  },

  /**
   * Fetch single user details by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<BackendUser>> {
    return apiClient<BackendUser>(`/admin/users/${userId}`);
  },

  /**
   * Update a user's status (ACTIVE or SUSPENDED)
   * Production API contract: PATCH /api/v1/admin/users/:userId/status
   * Request body strictly allows only: { status: 'ACTIVE' | 'SUSPENDED' }
   */
  async updateUserStatus(
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED'
  ): Promise<ApiResponse<BackendUser>> {
    return apiClient<BackendUser>(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
