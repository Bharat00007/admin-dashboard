export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | string;
  status?: string;
  mobile?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    message?: string;
    details?: any[];
  } | string;
}

export interface LoginResponseData {
  user: AdminUser;
  tokens?: AuthTokens;
  accessToken?: string;
  refreshToken?: string;
}

export interface RefreshResponseData {
  user?: Partial<AdminUser>;
  tokens?: AuthTokens;
  accessToken?: string;
  refreshToken?: string;
}
