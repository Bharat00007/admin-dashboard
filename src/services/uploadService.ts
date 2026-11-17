import { apiClient, getApiErrorMessage } from './apiClient';

export interface UploadResponse {
  url: string;
}

export const uploadService = {
  /**
   * Upload product image to production S3 bucket via:
   * POST /api/v1/uploads/products
   * Form-data key: 'file'
   * Constraints: JPG, PNG, WEBP, AVIF up to 1MB
   */
  async uploadProductImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type '${file.type || 'unknown'}'. Please select a JPG, PNG, or WEBP image.`,
      };
    }

    const MAX_SIZE_BYTES = 1024 * 1024; // 1MB backend limit
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return {
        success: false,
        error: `File size (${sizeMb} MB) exceeds maximum allowed size of 1 MB.`,
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', file, file.name);

      const res = await apiClient<UploadResponse>('/uploads/products', {
        method: 'POST',
        body: formData,
      });

      if (res.success && res.data?.url) {
        return {
          success: true,
          url: res.data.url,
        };
      }

      return {
        success: false,
        error: getApiErrorMessage(res, 'Failed to upload product image. Please try again.'),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error occurred while uploading image.',
      };
    }
  },

  /**
   * Upload brand logo to production S3 bucket via:
   * POST /api/v1/uploads/products
   * (Uses the production S3 upload pipeline, compatible with all catalog assets)
   */
  async uploadBrandLogo(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type '${file.type || 'unknown'}'. Please select a JPG, PNG, or WEBP image.`,
      };
    }

    const MAX_SIZE_BYTES = 1024 * 1024; // 1MB backend limit
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return {
        success: false,
        error: `File size (${sizeMb} MB) exceeds maximum allowed size of 1 MB.`,
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', file, file.name);

      const res = await apiClient<UploadResponse>('/uploads/products', {
        method: 'POST',
        body: formData,
      });

      if (res.success && res.data?.url) {
        return {
          success: true,
          url: res.data.url,
        };
      }

      return {
        success: false,
        error: getApiErrorMessage(res, 'Failed to upload brand logo. Please try again.'),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error occurred while uploading brand logo.',
      };
    }
  },

  /**
   * Upload category image to production S3 bucket via:
   * POST /api/v1/uploads/products
   */
  async uploadCategoryImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type '${file.type || 'unknown'}'. Please select a JPG, PNG, or WEBP image.`,
      };
    }

    const MAX_SIZE_BYTES = 1024 * 1024; // 1MB backend limit
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return {
        success: false,
        error: `File size (${sizeMb} MB) exceeds maximum allowed size of 1 MB.`,
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', file, file.name);

      const res = await apiClient<UploadResponse>('/uploads/products', {
        method: 'POST',
        body: formData,
      });

      if (res.success && res.data?.url) {
        return {
          success: true,
          url: res.data.url,
        };
      }

      return {
        success: false,
        error: getApiErrorMessage(res, 'Failed to upload category image. Please try again.'),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error occurred while uploading category image.',
      };
    }
  },
};
