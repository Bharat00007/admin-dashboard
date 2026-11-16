import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';

export interface BackendUnit {
  _id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendBrand {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendMasterProduct {
  _id: string;
  name: string;
  normalizedName?: string;
  description?: string | null;
  images?: string[];
  categoryId?: {
    _id: string;
    name: string;
    slug?: string;
    imageUrl?: string | null;
  } | string;
  brandId?: {
    _id: string;
    name: string;
    slug?: string;
    imageUrl?: string | null;
  } | string | null;
  unitId?: {
    _id: string;
    code: string;
    name: string;
  } | string;
  unitValue: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: PaginatedMeta;
}

export const catalogService = {
  // Units
  async getUnits(): Promise<ApiResponse<BackendUnit[]>> {
    return apiClient<BackendUnit[]>('/catalog/units');
  },

  async createUnit(payload: { name: string; code: string; isActive?: boolean }): Promise<ApiResponse<BackendUnit>> {
    return apiClient<BackendUnit>('/admin/catalog/units', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateUnit(id: string, payload: Partial<{ name: string; code: string; isActive: boolean }>): Promise<ApiResponse<BackendUnit>> {
    return apiClient<BackendUnit>(`/admin/catalog/units/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  // Categories
  async getCategories(): Promise<ApiResponse<BackendCategory[]>> {
    return apiClient<BackendCategory[]>('/catalog/categories');
  },

  async createCategory(payload: {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<BackendCategory>> {
    return apiClient<BackendCategory>('/admin/catalog/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateCategory(
    id: string,
    payload: Partial<{
      name: string;
      slug: string;
      description: string;
      imageUrl: string;
      isActive: boolean;
    }>
  ): Promise<ApiResponse<BackendCategory>> {
    return apiClient<BackendCategory>(`/admin/catalog/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  // Brands
  async getBrands(): Promise<ApiResponse<BackendBrand[]>> {
    return apiClient<BackendBrand[]>('/catalog/brands');
  },

  async createBrand(payload: {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<BackendBrand>> {
    return apiClient<BackendBrand>('/admin/catalog/brands', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateBrand(
    id: string,
    payload: Partial<{
      name: string;
      slug: string;
      description: string;
      imageUrl: string;
      isActive: boolean;
    }>
  ): Promise<ApiResponse<BackendBrand>> {
    return apiClient<BackendBrand>(`/admin/catalog/brands/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  // Master Products
  async getAdminProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    brandId?: string;
    isActive?: boolean;
  } = {}): Promise<ApiResponse<BackendMasterProduct[]> & { meta?: PaginatedMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.search) query.set('search', params.search.trim());
    if (params.categoryId) query.set('categoryId', params.categoryId);
    if (params.brandId) query.set('brandId', params.brandId);
    if (params.isActive !== undefined) query.set('isActive', params.isActive.toString());

    const qs = query.toString();
    const endpoint = `/admin/catalog/products${qs ? `?${qs}` : ''}`;
    return apiClient<BackendMasterProduct[]>(endpoint);
  },

  async getProductById(id: string): Promise<ApiResponse<BackendMasterProduct>> {
    return apiClient<BackendMasterProduct>(`/admin/catalog/products/${id}`);
  },

  async createProduct(payload: {
    name: string;
    description?: string;
    images?: string[];
    categoryId: string;
    brandId?: string | null;
    unitId: string;
    unitValue: number;
    isActive?: boolean;
  }): Promise<ApiResponse<BackendMasterProduct>> {
    return apiClient<BackendMasterProduct>('/admin/catalog/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateProduct(
    id: string,
    payload: Partial<{
      name: string;
      description: string;
      images: string[];
      categoryId: string;
      brandId: string | null;
      unitId: string;
      unitValue: number;
      isActive: boolean;
    }>
  ): Promise<ApiResponse<BackendMasterProduct>> {
    return apiClient<BackendMasterProduct>(`/admin/catalog/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
