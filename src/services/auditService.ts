import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';

export interface BackendAuditLog {
  _id: string;
  actorId?: {
    _id: string;
    role: string;
    email: string;
    name?: string | null;
  } | null;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  changes?: {
    before?: any;
    after?: any;
  } | null;
  requestId?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export const auditService = {
  /**
   * Get administrative audit logs with pagination and filters
   * GET /api/v1/admin/audit-logs
   */
  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    targetType?: string;
    action?: string;
  } = {}): Promise<ApiResponse<BackendAuditLog[]>> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.targetType) query.set('targetType', params.targetType);
    if (params.action) query.set('action', params.action);
    const qs = query.toString();
    return apiClient<BackendAuditLog[]>(`/admin/audit-logs${qs ? `?${qs}` : ''}`);
  },
};
