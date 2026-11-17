import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';

export interface BackendProductRequest {
  _id: string;
  shopId?: {
    _id: string;
    shopName: string;
    phone?: string;
    shopCode?: string;
  } | null;
  sellerId?: {
    _id: string;
    name?: string | null;
    mobile: string;
    email?: string | null;
  } | null;
  proposedName?: string;
  name?: string;
  description?: string | null;
  categoryId?: {
    _id: string;
    name: string;
    slug?: string;
    imageUrl?: string | null;
  } | null;
  brandId?: {
    _id: string;
    name: string;
    slug?: string;
    imageUrl?: string | null;
  } | null;
  unitId?: {
    _id: string;
    name: string;
    code: string;
  } | null;
  unitValue: number;
  imageUrl?: string | null;
  images?: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string | null;
  masterProductId?: string | null;
  sellerNotified?: boolean;
  reviewedBy?: {
    _id: string;
    name?: string | null;
  } | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const productRequestService = {
  /**
   * Get all product requests with pagination and status filter
   * GET /api/v1/admin/product-requests
   */
  async getProductRequests(params: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<BackendProductRequest[]>> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    const qs = query.toString();
    return apiClient<BackendProductRequest[]>(`/admin/product-requests${qs ? `?${qs}` : ''}`);
  },

  /**
   * Approve a product request
   * POST /api/v1/admin/product-requests/:id/approve
   */
  async approveProductRequest(id: string): Promise<ApiResponse<BackendProductRequest>> {
    return apiClient<BackendProductRequest>(`/admin/product-requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  /**
   * Reject a product request
   * POST /api/v1/admin/product-requests/:id/reject
   * Body contract: { adminNotes?: string }
   */
  async rejectProductRequest(id: string, adminNotes?: string): Promise<ApiResponse<BackendProductRequest>> {
    return apiClient<BackendProductRequest>(`/admin/product-requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({
        ...(adminNotes ? { adminNotes: adminNotes.trim() } : {}),
      }),
    });
  },
};
