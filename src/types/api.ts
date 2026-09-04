export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Laravel API Resource returns: { data: [...], meta: {...} }
export interface PaginatedResourceResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta?: PaginatedMeta;
  notifications?: any;
  orders?: any;
  tickets?: any;
  pagination?: any;
  [key: string]: any;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
  status?: number;
}