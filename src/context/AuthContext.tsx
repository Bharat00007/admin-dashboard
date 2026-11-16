import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AdminUser } from '../types/auth';
import { authService } from '../services/authService';
import { setOnAuthExpired, getApiErrorMessage } from '../services/apiClient';
import { tokenStorage } from '../utils/tokenStorage';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = tokenStorage.getAccessToken();
        const storedRefreshToken = tokenStorage.getRefreshToken();
        const storedUser = tokenStorage.getUser();

        if (storedToken && storedUser && storedUser.role === 'ADMIN') {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else if (storedRefreshToken) {
          // If access token is missing but refresh token exists, try rotating
          authService.refreshToken(storedRefreshToken).then(res => {
            const tokens = res.data?.tokens || res.data;
            if (res.success && tokens?.accessToken) {
              const updatedUser: AdminUser = (res.data?.user as AdminUser) || storedUser;
              tokenStorage.setAuth(
                {
                  accessToken: tokens.accessToken,
                  refreshToken: tokens.refreshToken || storedRefreshToken,
                },
                updatedUser
              );
              setUser(updatedUser);
              setIsAuthenticated(true);
            } else {
              tokenStorage.clearAuth();
              setUser(null);
              setIsAuthenticated(false);
            }
          }).catch(() => {
            tokenStorage.clearAuth();
            setUser(null);
            setIsAuthenticated(false);
          }).finally(() => {
            setIsLoading(false);
          });
          return;
        } else {
          tokenStorage.clearAuth();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('[AuthProvider] Failed to restore session', err);
        tokenStorage.clearAuth();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Hook up global API client session-expired callback
  useEffect(() => {
    setOnAuthExpired(() => {
      tokenStorage.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
      setAuthError('Your session has expired. Please sign in again.');
    });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    try {
      const response = await authService.login(email, password);

      if (!response.success || !response.data) {
        const message = getApiErrorMessage(response, 'Invalid email or password.');
        setAuthError(message);
        return { success: false, error: message };
      }

      const { user: rawUser, tokens: rawTokens, accessToken, refreshToken } = response.data;
      const actualAccessToken = rawTokens?.accessToken || accessToken;
      const actualRefreshToken = rawTokens?.refreshToken || refreshToken;

      if (!actualAccessToken) {
        const message = 'Server returned an invalid authentication response.';
        setAuthError(message);
        return { success: false, error: message };
      }

      if (rawUser.role !== 'ADMIN') {
        const message = 'Access denied. You do not have administrator permissions.';
        setAuthError(message);
        return { success: false, error: message };
      }

      const adminUser: AdminUser = {
        id: rawUser.id,
        name: rawUser.name || 'System Administrator',
        email: rawUser.email,
        role: rawUser.role,
        status: rawUser.status,
      };

      tokenStorage.setAuth(
        {
          accessToken: actualAccessToken,
          refreshToken: actualRefreshToken || '',
        },
        adminUser
      );

      setUser(adminUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err: any) {
      const message = err.message || 'Network error occurred while connecting to authentication service.';
      setAuthError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    const currentRefreshToken = tokenStorage.getRefreshToken();
    
    // Always clear local session immediately for secure instant exit
    tokenStorage.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);

    // Call server endpoint to revoke token asynchronously
    if (currentRefreshToken) {
      try {
        await authService.logout(currentRefreshToken);
      } catch (err) {
        console.warn('[AuthProvider] Server logout request failed, local session already revoked', err);
      }
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        authError,
        login,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
