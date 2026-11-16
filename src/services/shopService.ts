import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';
import { PaginatedMeta } from './catalogService';

export interface BackendShopAddress {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  landmark?: string | null;
}

export interface BackendShopSeller {
  _id: string;
  role: string;
  mobile: string;
  name?: string | null;
  email?: string | null;
  status: string;
}

export interface BackendVerificationDocument {
  documentType: string;
  documentNumber?: string | null;
  fileUrl: string;
  verifiedAt?: string | null;
}

export interface BackendWeeklyScheduleItem {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface BackendShop {
  _id: string;
  sellerId: BackendShopSeller | string;
  shopName: string;
  shopCode: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  phone: string;
  address?: BackendShopAddress | null;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  verificationDocuments?: BackendVerificationDocument[];
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string | null;
  isSuspended: boolean;
  customRadiusKm?: number | null;
  ratingAverage: number;
  ratingCount: number;
  weeklySchedule?: BackendWeeklyScheduleItem[];
  createdAt: string;
  updatedAt: string;
}

export const shopService = {
  /**
   * List shops with filtering and pagination
   */
  async getShops(params: {
    page?: number;
    limit?: number;
    approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
    isSuspended?: boolean;
    search?: string;
  } = {}): Promise<ApiResponse<BackendShop[]> & { meta?: PaginatedMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.approvalStatus) query.set('approvalStatus', params.approvalStatus);
    if (params.isSuspended !== undefined) query.set('isSuspended', params.isSuspended.toString());
    if (params.search) query.set('search', params.search.trim());

    const qs = query.toString();
    const endpoint = `/admin/shops${qs ? `?${qs}` : ''}`;
    return apiClient<BackendShop[]>(endpoint);
  },

  /**
   * Fetch single shop details by ID
   */
  async getShopById(shopId: string): Promise<ApiResponse<BackendShop>> {
    return apiClient<BackendShop>(`/admin/shops/${shopId}`);
  },

  /**
   * Approve a pending merchant onboarding request
   */
  async approveShop(shopId: string): Promise<ApiResponse<BackendShop>> {
    return apiClient<BackendShop>(`/admin/shops/${shopId}/approve`, {
      method: 'POST',
    });
  },

  /**
   * Reject a pending merchant onboarding request with a mandatory or optional reason
   */
  async rejectShop(shopId: string, reason?: string): Promise<ApiResponse<BackendShop>> {
    return apiClient<BackendShop>(`/admin/shops/${shopId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason?.trim() || 'Application rejected by platform administration.' }),
    });
  },

  /**
   * Suspend an active shop
   */
  async suspendShop(shopId: string, reason?: string): Promise<ApiResponse<BackendShop>> {
    return apiClient<BackendShop>(`/admin/shops/${shopId}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason?.trim() || 'Store suspended by platform administrator.' }),
    });
  },

  /**
   * Reactivate a suspended shop
   */
  async reactivateShop(shopId: string): Promise<ApiResponse<BackendShop>> {
    return apiClient<BackendShop>(`/admin/shops/${shopId}/reactivate`, {
      method: 'POST',
    });
  },

  /**
   * Update shop administrative details
   */
  async updateShopDetails(
    shopId: string,
    payload: { shopName?: string; customRadiusKm?: number | null }
  ): Promise<ApiResponse<BackendShop>> {
    return apiClient<BackendShop>(`/admin/shops/${shopId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
