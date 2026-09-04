export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  phone_verified_at?: string | null;
  avatar?: string | null;
  avatar_public_id?: string | null;
  role: 'customer' | 'admin' | 'staff';
  email_verified_at?: string | null;
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
  phone?: string;
  otp_session_token?: string;
}
