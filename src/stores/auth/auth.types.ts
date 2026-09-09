import { User, LoginPayload, RegisterPayload } from '../../types/auth';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  initialized: boolean;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';

  // Actions
  initialize: () => Promise<void>;
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}
