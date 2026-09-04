import { apiClient, setAuthToken } from './client';
import { User, LoginPayload, RegisterPayload } from '../types/auth';
import { ApiResponse } from '../types/api';

export const authApi = {
  async register(payload: RegisterPayload): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log('[AuthApi:Register] Initiating registration for:', payload.email);
    try {
      const res = await apiClient<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: payload,
      });
      console.log('[AuthApi:Register] Registration response received:', res);
      if (res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    } catch (err) {
      console.error('[AuthApi:Register] Registration failed:', err);
      throw err;
    }
  },

  async login(payload: LoginPayload): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log('[AuthApi:Login] Attempting password login for:', payload.email);
    try {
      const res = await apiClient<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: payload,
      });
      console.log('[AuthApi:Login] Login response received:', res);
      if (res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    } catch (err) {
      console.error('[AuthApi:Login] Login failed:', err);
      throw err;
    }
  },

  async logout(): Promise<ApiResponse<object>> {
    console.log('[AuthApi:Logout] Logging out current session');
    try {
      const res = await apiClient<object>('/auth/logout', { method: 'POST' });
      console.log('[AuthApi:Logout] Logout successful:', res);
      return res;
    } catch (err) {
      console.warn('[AuthApi:Logout] Logout request failed (clearing client state anyway):', err);
      return { success: true, message: 'Logged out locally' } as any;
    } finally {
      setAuthToken(null);
    }
  },

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    console.log('[AuthApi:User] Fetching current authenticated user profile');
    try {
      const res = await apiClient<{ user: User }>('/auth/user');
      console.log('[AuthApi:User] Current user retrieved:', res);
      return res;
    } catch (err) {
      console.warn('[AuthApi:User] Current user fetch failed:', err);
      throw err;
    }
  },

  async changePassword(payload: { current_password: string; new_password: string; new_password_confirmation: string }) {
    console.log('[AuthApi:ChangePassword] Submitting password change request');
    try {
      const res = await apiClient('/auth/change-password', {
        method: 'POST',
        body: payload,
      });
      console.log('[AuthApi:ChangePassword] Password change response:', res);
      return res;
    } catch (err) {
      console.error('[AuthApi:ChangePassword] Password change failed:', err);
      throw err;
    }
  },

  async forgotPassword(email: string) {
    console.log('[AuthApi:ForgotPassword] Requesting reset link for:', email);
    try {
      const res = await apiClient('/auth/forgot-password', {
        method: 'POST',
        body: { email },
      });
      console.log('[AuthApi:ForgotPassword] Reset link response:', res);
      return res;
    } catch (err) {
      console.error('[AuthApi:ForgotPassword] Reset request failed:', err);
      throw err;
    }
  },

  async resetPassword(payload: any) {
    console.log('[AuthApi:ResetPassword] Resetting password');
    try {
      const res = await apiClient('/auth/reset-password', {
        method: 'POST',
        body: payload,
      });
      console.log('[AuthApi:ResetPassword] Reset result:', res);
      return res;
    } catch (err) {
      console.error('[AuthApi:ResetPassword] Reset failed:', err);
      throw err;
    }
  },
};
