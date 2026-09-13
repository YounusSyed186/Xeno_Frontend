import { apiClient, setAuthToken } from './client';
import { ApiResponse } from '../types/api';
import { User } from '../types/auth';

export interface SendOtpPayload {
  phone: string;
  purpose?: 'signup' | 'login' | 'phone_change' | 'checkout' | undefined;
}

export interface SendOtpResponse {
  session_token: string;
  cooldown_seconds: number;
  expires_in_minutes: number;
  phone_masked: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
  session_token?: string | undefined;
}

export interface VerifyOtpResponse {
  phone: string;
  session_token: string;
  verified: boolean;
}

export interface ResendOtpPayload {
  phone: string;
  retry_type?: 'text' | 'voice' | undefined;
  session_token?: string | undefined;
}

export const otpApi = {
  /**
   * Request an OTP to be sent to a mobile number
   */
  async sendOtp(payload: SendOtpPayload): Promise<ApiResponse<SendOtpResponse>> {
    console.log('[OtpApi:SendOtp] Sending OTP request for phone:', payload.phone, 'purpose:', payload.purpose || 'signup');
    try {
      const res = await apiClient<SendOtpResponse>('/auth/otp/send', {
        method: 'POST',
        body: payload,
      });
      console.log('[OtpApi:SendOtp] OTP send successful:', res);
      return res;
    } catch (err) {
      console.error('[OtpApi:SendOtp] OTP send error:', err);
      throw err;
    }
  },

  /**
   * Verify an entered OTP against MSG91 backend service
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<VerifyOtpResponse>> {
    console.log('[OtpApi:VerifyOtp] Verifying OTP for phone:', payload.phone, 'with session:', payload.session_token);
    try {
      const res = await apiClient<VerifyOtpResponse>('/auth/otp/verify', {
        method: 'POST',
        body: payload,
      });
      console.log('[OtpApi:VerifyOtp] OTP verify response:', res);
      return res;
    } catch (err) {
      console.error('[OtpApi:VerifyOtp] OTP verify error:', err);
      throw err;
    }
  },

  /**
   * Resend an OTP respecting cooldown
   */
  async resendOtp(payload: ResendOtpPayload): Promise<ApiResponse<{ cooldown_seconds: number }>> {
    console.log('[OtpApi:ResendOtp] Resending OTP for phone:', payload.phone);
    try {
      const res = await apiClient<{ cooldown_seconds: number }>('/auth/otp/resend', {
        method: 'POST',
        body: payload,
      });
      console.log('[OtpApi:ResendOtp] Resend response:', res);
      return res;
    } catch (err) {
      console.error('[OtpApi:ResendOtp] Resend error:', err);
      throw err;
    }
  },

  /**
   * Log in using a verified OTP session
   */
  async loginWithOtp(phone: string, sessionToken: string): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log('[OtpApi:LoginWithOtp] Logging in with verified OTP session for phone:', phone);
    try {
      const res = await apiClient<{ user: User; token: string }>('/auth/login-otp', {
        method: 'POST',
        body: {
          phone,
          session_token: sessionToken,
        },
      });

      console.log('[OtpApi:LoginWithOtp] OTP login response:', res);
      if (res.data?.token) {
        setAuthToken(res.data.token);
      }

      return res;
    } catch (err) {
      console.error('[OtpApi:LoginWithOtp] OTP login failed:', err);
      throw err;
    }
  },
};
