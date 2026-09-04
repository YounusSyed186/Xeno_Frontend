import React, { useEffect } from 'react';
import { useAuthStore } from './auth/auth.store';
import { User, LoginPayload, RegisterPayload } from '../types/auth';

export { useAuthStore } from './auth/auth.store';
export type { AuthState, AuthStatus } from './auth/auth.types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (payload: LoginPayload | string, password?: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
};

export function useAuthContext(): AuthContextType {
  const store = useAuthStore();

  const handleLogin = async (payloadOrEmail: LoginPayload | string, password?: string) => {
    if (typeof payloadOrEmail === 'string') {
      return store.login({ email: payloadOrEmail, password: password || '' });
    }
    return store.login(payloadOrEmail);
  };

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isAdmin: store.isAdmin,
    isLoading: store.status === 'loading' && !store.initialized,
    authModalOpen: store.authModalOpen,
    authModalTab: store.authModalTab,
    openAuthModal: store.openAuthModal,
    closeAuthModal: store.closeAuthModal,
    login: handleLogin,
    register: store.register,
    logout: store.logout,
    refreshUser: store.refreshUser,
  };
}
