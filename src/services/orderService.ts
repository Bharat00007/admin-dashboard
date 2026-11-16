import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';
import { PaginatedMeta } from './catalogService';

export interface BackendOrderItem {
  _id: string;
  sellerProductId: string;
  masterProductId: string;
  quantity: number;
  originalProductName: string;
  originalUnitPricePaise: number;
  originalLineTotalPaise: number;
  itemStatus: string;
}

export interface BackendOrder {
  _id: string;
  orderNumber: string;
  customerId: string;
  shopId: string;
  status: 'PLACED' | 'ACCEPTED' | 'PREPARING' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  items: BackendOrderItem[];
  subtotalPaise: number;
  deliveryChargePaise: number;
  totalPaise: number;
  deliveryAddressSnapshot?: {
    recipientName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  shopSnapshot?: {
    shopName?: string;
    shopCode?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      pincode?: string;
    };
  };
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const orderService = {
  /**
   * List orders across the platform (Admin sees all orders)
   */
  async getOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<ApiResponse<BackendOrder[]> & { meta?: PaginatedMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.status) query.set('status', params.status);

    const qs = query.toString();
    const endpoint = `/orders${qs ? `?${qs}` : ''}`;
    return apiClient<BackendOrder[]>(endpoint);
  },

  /**
   * Fetch single order details by ID
   */
  async getOrderById(orderId: string): Promise<ApiResponse<BackendOrder>> {
    return apiClient<BackendOrder>(`/orders/${orderId}`);
  },
};
