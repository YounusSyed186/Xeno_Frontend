export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null | undefined;
  phone_verified_at?: string | null | undefined;
  avatar?: string | null | undefined;
  avatar_public_id?: string | null | undefined;
  role: 'customer' | 'admin' | 'staff';
  email_verified_at?: string | null | undefined;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  guestToken: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string | undefined;
  otp_session_token?: string | undefined;
}
