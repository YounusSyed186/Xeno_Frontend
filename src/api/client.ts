import { ApiResponse, ApiError } from '../types/api';

const BASE_URL = (import.meta.env as Record<string, string>)['VITE_API_URL'] || 'http://localhost:8000/api/v1';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('xenocraft_token');
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('xenocraft_token', token);
  } else {
    localStorage.removeItem('xenocraft_token');
  }
}

export function getGuestToken(): string {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem('xenocraft_guest_token');
  if (!token) {
    token = 'guest_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('xenocraft_guest_token', token);
  }
  return token;
}

export function clearGuestToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('xenocraft_guest_token');
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  params?: Record<string, any> | undefined;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, params, headers: customHeaders, ...customConfig } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = getAuthToken();
  const guestToken = getGuestToken();

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-Guest-Token': guestToken,
    ...((customHeaders as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let finalBody: any = body;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    finalBody = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers,
      body: finalBody,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error: ApiError = {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
        errors: data.errors || {},
        code: data.code || 'HTTP_ERROR',
        status: response.status,
      };

      if (response.status === 401) {
        setAuthToken(null);
      }

      throw error;
    }

    return data as ApiResponse<T>;
  } catch (err: any) {
    if (err.success === false) {
      throw err;
    }

    const networkError: ApiError = {
      success: false,
      message: err.message || 'Network connection failed. Please check your connection.',
      code: 'NETWORK_ERROR',
      status: 0,
    };
    throw networkError;
  }
}
