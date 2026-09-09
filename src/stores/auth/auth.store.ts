import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthStatus } from './auth.types';
import { User, LoginPayload, RegisterPayload } from '../../types/auth';
import { authApi } from '../../api/auth.api';
import { getAuthToken, setAuthToken, getGuestToken } from '../../api/client';
import { cartApi } from '../../api/cart.api';

function checkIsAdmin(user: User | null): boolean {
  if (!user) return false;
  const anyUser = user as any;
  if (user.role === 'admin') return true;
  if (Array.isArray(anyUser.roles) && anyUser.roles.some((r: any) => r?.name === 'admin')) return true;
  return false;
}

let initPromise: Promise<void> | null = null;

const authStoreCore = (set: any, get: any) => ({
  status: 'loading' as AuthStatus,
  initialized: false,
  user: null as User | null,
  token: null as string | null,
  isAuthenticated: false,
  isAdmin: false,
  authModalOpen: false,
  authModalTab: 'login' as 'login' | 'register',

  openAuthModal: (tab: 'login' | 'register' = 'login') => {
    set({ authModalTab: tab, authModalOpen: true });
  },

  closeAuthModal: () => {
    set({ authModalOpen: false });
  },

  setUser: (user: User | null) => {
    const isAdmin = checkIsAdmin(user);
    const isAuthenticated = !!user;
    const status: AuthStatus = isAuthenticated ? 'authenticated' : 'unauthenticated';
    set({ user, isAdmin, isAuthenticated, status });
  },

  initialize: async () => {
    if (get().initialized) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      const currentToken = getAuthToken();
      console.log('[AuthStore:Init] Checking existing token on start:', currentToken ? 'Token present' : 'No token');
      if (!currentToken) {
        set({
          status: 'unauthenticated',
          initialized: true,
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
        initPromise = null;
        return;
      }

      try {
        const res = await authApi.getCurrentUser();
        if (res.success && res.data?.user) {
          const user = res.data.user;
          const isAdmin = checkIsAdmin(user);
          console.log('[AuthStore:Init] Session verified for user:', user.email, 'Role:', user.role, 'isAdmin:', isAdmin);
          set({
            status: 'authenticated',
            initialized: true,
            user,
            token: currentToken,
            isAuthenticated: true,
            isAdmin,
          });
        } else {
          console.warn('[AuthStore:Init] Session invalid, clearing token');
          setAuthToken(null);
          set({
            status: 'unauthenticated',
            initialized: true,
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
          });
        }
      } catch (err) {
        console.warn('[AuthStore:Init] Session restoration error, resetting state:', err);
        setAuthToken(null);
        set({
          status: 'unauthenticated',
          initialized: true,
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      } finally {
        initPromise = null;
      }
    })();

    return initPromise;
  },

  refreshUser: async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      set({
        status: 'unauthenticated',
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
      });
      return;
    }

    try {
      const res = await authApi.getCurrentUser();
      if (res.success && res.data?.user) {
        const user = res.data.user;
        const isAdmin = checkIsAdmin(user);
        console.log('[AuthStore:Refresh] User refreshed:', user.email);
        set({
          status: 'authenticated',
          user,
          token: currentToken,
          isAuthenticated: true,
          isAdmin,
        });
      } else {
        setAuthToken(null);
        set({
          status: 'unauthenticated',
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      }
    } catch {
      setAuthToken(null);
      set({
        status: 'unauthenticated',
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    }
  },

  fetchCurrentUser: async () => {
    await get().refreshUser();
  },

  login: async (payload: LoginPayload) => {
    set({ status: 'loading' });
    console.log('[AuthStore:Login] Submitting credentials for:', payload.email);
    try {
      const res = await authApi.login(payload);
      if (res.success && res.data?.user) {
        const user = res.data.user;
        const token = res.data.token;
        const isAdmin = checkIsAdmin(user);

        console.log('[AuthStore:Login] Login successful for:', user.email, 'Role:', user.role, 'isAdmin:', isAdmin);

        set({
          status: 'authenticated',
          initialized: true,
          user,
          token,
          isAuthenticated: true,
          isAdmin,
          authModalOpen: false,
        });

        if (getGuestToken()) {
          try {
            console.log('[AuthStore:Login] Merging guest cart...');
            await cartApi.mergeGuestCart();
          } catch {
            // merge fail soft
          }
        }
      } else {
        set({ status: 'unauthenticated' });
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      console.error('[AuthStore:Login] Login error:', err);
      set({ status: 'unauthenticated' });
      throw err;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ status: 'loading' });
    console.log('[AuthStore:Register] Submitting registration for:', payload.email);
    try {
      const res = await authApi.register(payload);
      if (res.success && res.data?.user) {
        const user = res.data.user;
        const token = res.data.token;
        const isAdmin = checkIsAdmin(user);

        console.log('[AuthStore:Register] Registration successful for:', user.email);

        set({
          status: 'authenticated',
          initialized: true,
          user,
          token,
          isAuthenticated: true,
          isAdmin,
          authModalOpen: false,
        });
      } else {
        set({ status: 'unauthenticated' });
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err) {
      console.error('[AuthStore:Register] Registration error:', err);
      set({ status: 'unauthenticated' });
      throw err;
    }
  },

  logout: async () => {
    set({ status: 'loading' });
    console.log('[AuthStore:Logout] Initiating logout...');
    try {
      await authApi.logout();
    } catch {
      // soft fail on network logout
    } finally {
      setAuthToken(null);
      console.log('[AuthStore:Logout] Client auth session cleared');
      set({
        status: 'unauthenticated',
        initialized: true,
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    }
  },
});

export const useAuthStore = create<AuthState>()(
  persist(authStoreCore, {
    name: 'xeno-auth',
    partialize: (state) => ({
      token: state.token,
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isAdmin: state.isAdmin,
    }),
    onRehydrateStorage: () => (state) => {
      if (state) {
        const token = getAuthToken();
        if (token && state.token !== token) {
          state.setUser(state.user);
        }
      }
    },
  })
);