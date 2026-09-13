import { toast } from 'sonner';

export interface ErrorAction {
  label: string;
  to?: string | undefined;
  onClick?: (() => void) | undefined;
}

export interface ErrorMapping {
  title: string;
  message: string;
  action?: ErrorAction | undefined;
}

/**
 * Standardized machine-readable error dictionary for Xeno Craft.
 */
export const ERROR_MAPPINGS = {
  EMAIL_ALREADY_EXISTS: {
    title: 'Email already registered',
    message: 'An account with this email already exists. Please sign in or use a different email address.',
    action: { label: 'Sign In', to: '/login' },
  },
  INVALID_CREDENTIALS: {
    title: 'Invalid credentials',
    message: 'Incorrect email or password. Please check your credentials and try again.',
  },
  ACCOUNT_NOT_FOUND: {
    title: 'Account not found',
    message: "We couldn't find an account associated with that email address.",
  },
  ACCOUNT_SUSPENDED: {
    title: 'Account suspended',
    message: 'Your account has been suspended. Please contact customer support for assistance.',
    action: { label: 'Contact Support', to: '/support' },
  },
  EMAIL_NOT_VERIFIED: {
    title: 'Email not verified',
    message: 'Please verify your email address to continue.',
  },
  INVALID_VERIFICATION_CODE: {
    title: 'Invalid verification code',
    message: 'The code you entered is invalid. Please double check and try again.',
  },
  VERIFICATION_CODE_EXPIRED: {
    title: 'Code expired',
    message: 'Your verification code has expired. Please request a new one.',
  },
  UNAUTHENTICATED: {
    title: 'Session expired',
    message: 'Your session has expired. Please sign in again.',
    action: { label: 'Sign In', to: '/login' },
  },
  FORBIDDEN: {
    title: 'Access restricted',
    message: "You don't have permission to perform this action.",
  },
  NOT_FOUND: {
    title: 'Not found',
    message: 'The requested resource could not be found.',
  },
  PRODUCT_NOT_FOUND: {
    title: 'Product unavailable',
    message: 'This product is no longer available or could not be found.',
    action: { label: 'Browse Products', to: '/products' },
  },
  PRODUCT_UNAVAILABLE: {
    title: 'Product unavailable',
    message: 'This product is currently inactive or not available for ordering.',
    action: { label: 'Browse Products', to: '/products' },
  },
  VARIANT_UNAVAILABLE: {
    title: 'Option unavailable',
    message: 'This size and color combination is currently unavailable.',
  },
  OUT_OF_STOCK: {
    title: 'Out of stock',
    message: 'This item is currently out of stock.',
  },
  CART_EMPTY: {
    title: 'Cart is empty',
    message: 'Your cart is empty. Please add items to your cart before checking out.',
    action: { label: 'Shop Now', to: '/products' },
  },
  INVALID_QUANTITY: {
    title: 'Invalid quantity',
    message: 'Please enter a valid quantity within available stock limits.',
  },
  INVALID_COUPON: {
    title: 'Invalid coupon',
    message: 'This coupon code is invalid or has expired.',
  },
  CHECKOUT_FAILED: {
    title: 'Checkout failed',
    message: "We couldn't process your order. Please check your delivery address and items.",
  },
  PAYMENT_FAILED: {
    title: 'Payment failed',
    message: "Payment couldn't be completed. Please try again or choose another payment method.",
  },
  PAYMENT_CANCELLED: {
    title: 'Payment cancelled',
    message: 'Payment was cancelled. Your order has not been placed.',
  },
  INVALID_ADDRESS: {
    title: 'Invalid address',
    message: 'Please check your delivery address details and postal code.',
  },
  ADDRESS_NOT_FOUND: {
    title: 'Address not found',
    message: 'The selected delivery address could not be found.',
  },
  ALREADY_IN_WISHLIST: {
    title: 'Already in wishlist',
    message: 'This product is already in your wishlist.',
  },
  INVALID_FILE_TYPE: {
    title: 'Unsupported file type',
    message: 'Please upload a PNG, JPG, WEBP, AVIF, or SVG image file.',
  },
  FILE_TOO_LARGE: {
    title: 'File is too large',
    message: 'Please upload a smaller file (under 20MB).',
  },
  UPLOAD_FAILED: {
    title: 'Upload failed',
    message: "We couldn't upload your artwork. Please try again.",
  },
  TICKET_CREATE_FAILED: {
    title: 'Support request failed',
    message: "We couldn't create your support ticket. Please try again.",
  },
  TOO_MANY_REQUESTS: {
    title: 'Too many attempts',
    message: 'Too many requests. Please wait a moment and try again.',
  },
  NETWORK_ERROR: {
    title: 'Unable to connect',
    message: 'Please check your internet connection and try again.',
  },
  TIMEOUT_ERROR: {
    title: 'Request timed out',
    message: 'This is taking longer than expected. Please try again.',
  },
  DUPLICATE_ENTRY: {
    title: 'Record already exists',
    message: 'This item already exists or conflicts with existing information.',
  },
  DATABASE_ERROR: {
    title: 'Database error',
    message: 'We encountered an issue saving your data. Please try again.',
  },
  SERVER_ERROR: {
    title: 'Something went wrong',
    message: 'Something went wrong on our side. Please try again in a few moments.',
  },
  VALIDATION_ERROR: {
    title: 'Please check your input',
    message: 'Please correct the highlighted fields below.',
  },
} satisfies Record<string, ErrorMapping>;

/**
 * Normalized application error class.
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly fieldErrors: Record<string, string>;
  public readonly status: number;
  public readonly retryable: boolean;
  public readonly title?: string | undefined;
  public readonly action?: ErrorAction | undefined;
  public readonly raw?: any;

  constructor(params: {
    message: string;
    code?: string | undefined;
    fieldErrors?: Record<string, string> | undefined;
    status?: number | undefined;
    retryable?: boolean | undefined;
    title?: string | undefined;
    action?: ErrorAction | undefined;
    raw?: any;
  }) {
    super(params.message);
    this.name = 'AppError';
    this.code = params.code || 'UNKNOWN_ERROR';
    this.fieldErrors = params.fieldErrors || {};
    this.status = params.status || 0;
    this.retryable = params.retryable ?? (this.status >= 500 || this.status === 0);
    this.title = params.title;
    this.action = params.action;
    this.raw = params.raw;

    // Maintain prototype chain
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Central utility to parse and normalize any backend/network error into an AppError.
 */
export function normalizeApiError(err: unknown, fallbackMessage?: string): AppError {
  if (err instanceof AppError) {
    return err;
  }

  // Handle standard ApiError / Axios / Fetch response objects
  const raw = err as any;
  let status = typeof raw?.status === 'number' ? raw.status : 0;
  let code = raw?.code || '';
  let rawMessage = raw?.message || '';
  const rawErrors = raw?.errors;

  // Extract and flatten field-level errors
  const fieldErrors: Record<string, string> = {};
  if (rawErrors && typeof rawErrors === 'object' && !Array.isArray(rawErrors)) {
    for (const [key, val] of Object.entries(rawErrors)) {
      if (Array.isArray(val) && val.length > 0) {
        fieldErrors[key] = String(val[0]);
      } else if (typeof val === 'string') {
        fieldErrors[key] = val;
      }
    }
  }

  // Detect email duplicate in field errors if code wasn't explicitly set
  if (fieldErrors['email']) {
    const emailMsg = fieldErrors['email'].toLowerCase();
    if (emailMsg.includes('already') || emailMsg.includes('taken') || emailMsg.includes('exists')) {
      code = 'EMAIL_ALREADY_EXISTS';
      fieldErrors['email'] = 'This email is already registered.';
    }
  }

  // Detect specific network / offline conditions
  if (
    raw?.name === 'TypeError' &&
    (rawMessage.includes('Failed to fetch') || rawMessage.includes('NetworkError') || rawMessage.includes('Load failed'))
  ) {
    code = 'NETWORK_ERROR';
    status = 0;
  } else if (rawMessage.includes('timeout') || raw?.name === 'TimeoutError') {
    code = 'TIMEOUT_ERROR';
    status = 504;
  }

  // Map known machine-readable code
  const mapping = (ERROR_MAPPINGS as Record<string, ErrorMapping | undefined>)[code];

  // Resolve message with fallback priority:
  // 1. Known error code mapping
  // 2. Safe, non-technical backend message (avoiding raw 422, 500, AxiosError, SQLSTATE)
  // 3. Status code safe translation
  // 4. Default fallback
  let message = '';
  let title = mapping?.title;
  let action = mapping?.action;

  if (mapping) {
    message = mapping.message;
  } else if (rawMessage && !isTechnicalErrorString(rawMessage)) {
    message = rawMessage;
  } else if (status === 401) {
    title = ERROR_MAPPINGS.UNAUTHENTICATED.title;
    message = ERROR_MAPPINGS.UNAUTHENTICATED.message;
    action = ERROR_MAPPINGS.UNAUTHENTICATED.action;
    code = 'UNAUTHENTICATED';
  } else if (status === 403) {
    title = ERROR_MAPPINGS.FORBIDDEN.title;
    message = ERROR_MAPPINGS.FORBIDDEN.message;
    code = 'FORBIDDEN';
  } else if (status === 404) {
    title = ERROR_MAPPINGS.NOT_FOUND.title;
    message = ERROR_MAPPINGS.NOT_FOUND.message;
    code = 'NOT_FOUND';
  } else if (status === 409) {
    title = ERROR_MAPPINGS.DUPLICATE_ENTRY.title;
    message = ERROR_MAPPINGS.DUPLICATE_ENTRY.message;
    code = 'DUPLICATE_ENTRY';
  } else if (status === 422) {
    title = ERROR_MAPPINGS.VALIDATION_ERROR.title;
    message = Object.keys(fieldErrors).length > 0
      ? 'Please correct the highlighted fields below.'
      : 'The submitted information is invalid. Please check your entries.';
    code = code || 'VALIDATION_ERROR';
  } else if (status === 429) {
    title = ERROR_MAPPINGS.TOO_MANY_REQUESTS.title;
    message = ERROR_MAPPINGS.TOO_MANY_REQUESTS.message;
    code = 'TOO_MANY_REQUESTS';
  } else if (status >= 500) {
    title = ERROR_MAPPINGS.SERVER_ERROR.title;
    message = ERROR_MAPPINGS.SERVER_ERROR.message;
    code = code || 'SERVER_ERROR';
  } else {
    message = fallbackMessage || 'Something went wrong. Please try again.';
    title = 'Error';
    code = code || 'UNKNOWN_ERROR';
  }

  return new AppError({
    message,
    title,
    code,
    fieldErrors,
    status,
    retryable: status >= 500 || status === 0,
    action,
    raw: err,
  });
}

/**
 * Check if a raw string contains internal framework/stack/database error traces.
 */
function isTechnicalErrorString(str: string): boolean {
  if (!str || typeof str !== 'string') return true;
  const technicalPatterns = [
    'SQLSTATE',
    'Integrity constraint',
    'AxiosError',
    'FetchError',
    'Request failed with status code',
    'Unprocessable Content',
    '422',
    '500 Internal',
    'Cannot read property',
    'Cannot read properties',
    'undefined is not an object',
    'TypeError:',
    'ReferenceError:',
    'at ',
    'vendor/laravel',
    'App\\Exceptions',
  ];
  return technicalPatterns.some((pattern) => str.includes(pattern));
}

/**
 * Centralized user-friendly toast trigger for error reporting.
 */
export function showErrorToast(err: unknown, fallbackMessage?: string) {
  const normalized = normalizeApiError(err, fallbackMessage);

  if (normalized.action?.to) {
    return toast.error(normalized.title || 'Action Required', {
      description: normalized.message,
      action: {
        label: normalized.action.label,
        onClick: () => {
          if (typeof window !== 'undefined' && normalized.action?.to) {
            window.location.href = normalized.action.to;
          }
        },
      },
    });
  }

  if (normalized.title && normalized.title !== 'Error') {
    return toast.error(normalized.title, {
      description: normalized.message,
    });
  }

  return toast.error(normalized.message);
}
