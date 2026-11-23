import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';

export interface BackendIssue {
  _id: string;
  orderId?: {
    _id: string;
    orderNumber: string;
    status: string;
    totalPaise: number;
    createdAt: string;
  } | string | null;
  customerId?: {
    _id: string;
    mobile: string;
    name?: string | null;
    email?: string | null;
  } | string | null;
  shopId?: {
    _id: string;
    shopName: string;
    phone: string;
  } | string | null;
  orderStatusAtReport?: string | null;
  problemType?: string | null;
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED_NO_ACTION';
  adminNotes?: string | null;
  reviewedBy?: {
    _id: string;
    name?: string | null;
    mobile?: string | null;
  } | string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const issueService = {
  /**
   * Get all issues with optional filtering and pagination
   * GET /api/v1/admin/issues
   * Accepts status, orderStatusAtReport ('PREPARING' | 'COMPLETED'), page, limit
   */
  async getIssues(params: {
    status?: string;
    orderStatusAtReport?: 'PREPARING' | 'COMPLETED' | string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<BackendIssue[]>> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.orderStatusAtReport) query.set('orderStatusAtReport', params.orderStatusAtReport);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    const qs = query.toString();
    return apiClient<BackendIssue[]>(`/admin/issues${qs ? `?${qs}` : ''}`);
  },

  /**
   * Update issue status and admin notes
   * PATCH /api/v1/admin/issues/:issueId
   * Strict contract: { status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED_NO_ACTION', adminNotes?: string | null }
   */
  async updateIssueStatus(
    issueId: string,
    payload: {
      status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED_NO_ACTION';
      adminNotes?: string | null;
    }
  ): Promise<ApiResponse<BackendIssue>> {
    const body: Record<string, any> = {
      status: payload.status,
    };
    if (payload.adminNotes !== undefined) {
      body.adminNotes = typeof payload.adminNotes === 'string' && payload.adminNotes.trim().length > 0
        ? payload.adminNotes.trim()
        : null;
    }
    return apiClient<BackendIssue>(`/admin/issues/${issueId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
};
