import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { OtpVerificationModal } from '@/components/auth/OtpVerificationModal';
import { otpApi } from '@/api/otp.api';
import { normalizeApiError, showErrorToast, AppError } from '@/lib/errors';
import { InlineFieldError } from '@/components/feedback/InlineFieldError';
import { Sparkles, ArrowRight, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/register')({
  component: RegisterComponent,
});

function RegisterComponent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<{ title: string; message: string; action?: { label: string; to: string } } | null>(null);

  // Input refs for focus management
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // OTP Verification State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpSessionToken, setOtpSessionToken] = useState<string | null>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const { register, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  const handleSendOtp = async () => {
    if (!phone || phone.trim().length < 10) {
      setFieldErrors((prev) => ({ ...prev, phone: 'Please enter a valid 10-digit mobile number' }));
      phoneRef.current?.focus();
      return;
    }

    setIsSendingOtp(true);
    setFieldErrors((prev) => ({ ...prev, phone: '' }));
    try {
      const res = await otpApi.sendOtp({
        phone: phone.trim(),
        purpose: 'signup',
      });

      if (res.data?.session_token) {
        setOtpSessionToken(res.data.session_token);
        setIsOtpModalOpen(true);
        toast.success('Verification code sent to your mobile');
      }
    } catch (err: any) {
      const normalized = normalizeApiError(err, 'Failed to send verification code');
      showErrorToast(normalized);
      if (normalized.fieldErrors.phone) {
        setFieldErrors((prev) => ({ ...prev, phone: normalized.fieldErrors.phone }));
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpVerified = (sessionToken: string) => {
    setOtpSessionToken(sessionToken);
    setIsPhoneVerified(true);
    toast.success('Mobile verified successfully!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setTopError(null);

    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (password !== passwordConfirmation) {
      errors.password_confirmation = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.name) nameRef.current?.focus();
      else if (errors.email) emailRef.current?.focus();
      else if (errors.password) passwordRef.current?.focus();
      else if (errors.password_confirmation) confirmPasswordRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        otp_session_token: otpSessionToken || undefined,
        password,
        password_confirmation: passwordConfirmation,
      });

      toast.success('Account created successfully! Welcome to Xeno Craft.');
      navigate({ to: '/' });
    } catch (err: any) {
      const normalized: AppError = normalizeApiError(err, 'Failed to create account. Please try again.');

      if (normalized.code === 'EMAIL_ALREADY_EXISTS') {
        setFieldErrors({
          email: 'This email is already registered.',
        });
        setTopError({
          title: 'Email already registered',
          message: 'An account with this email already exists. Please sign in or use a different email address.',
          action: { label: 'Sign in instead', to: '/login' },
        });
        emailRef.current?.focus();
        showErrorToast(normalized);
      } else if (Object.keys(normalized.fieldErrors).length > 0) {
        setFieldErrors(normalized.fieldErrors);
        setTopError({
          title: 'Please check the highlighted fields',
          message: normalized.message,
        });

        // Focus first invalid field
        if (normalized.fieldErrors.name) nameRef.current?.focus();
        else if (normalized.fieldErrors.email) emailRef.current?.focus();
        else if (normalized.fieldErrors.phone) phoneRef.current?.focus();
        else if (normalized.fieldErrors.password) passwordRef.current?.focus();
        else if (normalized.fieldErrors.password_confirmation) confirmPasswordRef.current?.focus();

        showErrorToast(normalized);
      } else {
        setTopError({
          title: normalized.title || 'Registration failed',
          message: normalized.message,
          action: normalized.action ? { label: normalized.action.label, to: normalized.action.to || '/login' } : undefined,
        });
        showErrorToast(normalized);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4 pt-28 sm:pt-36 pb-20">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border/40 bg-card/70 p-8 shadow-xl backdrop-blur-md">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold text-primary mb-2">
            <Sparkles className="size-3.5" /> Start Customising
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">Create Account</h1>
          <p className="text-xs text-muted-foreground">Join Xeno Craft for live 3D custom apparel configuration and bulk discounts</p>
        </div>

        {/* Top-Level Contextual Error Alert */}
        {topError && (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-foreground space-y-2 animate-in fade-in-0 duration-200"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-destructive">{topError.title}</p>
                <p className="text-muted-foreground leading-relaxed">{topError.message}</p>
              </div>
            </div>
            {topError.action && (
              <div className="pt-1 pl-6.5">
                <Link
                  to={topError.action.to}
                  className="inline-flex items-center gap-1 font-bold text-primary hover:underline text-xs"
                >
                  <LogIn className="size-3.5" />
                  {topError.action.label}
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2" noValidate>
          <div>
            <label htmlFor="reg-name" className="block text-xs font-semibold text-muted-foreground mb-1.5">Full Name *</label>
            <input
              id="reg-name"
              ref={nameRef}
              type="text"
              required
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? 'reg-name-error' : undefined}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
              }}
              className={`w-full rounded-xl border ${fieldErrors.name ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 min-h-11`}
              placeholder="Your full name"
            />
            <InlineFieldError id="reg-name-error" error={fieldErrors.name} />
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-muted-foreground mb-1.5">Email Address *</label>
            <input
              id="reg-email"
              ref={emailRef}
              type="email"
              required
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'reg-email-error' : undefined}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
              }}
              className={`w-full rounded-xl border ${fieldErrors.email ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 min-h-11`}
              placeholder="name@company.com"
            />
            <InlineFieldError id="reg-email-error" error={fieldErrors.email} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="reg-phone" className="block text-xs font-semibold text-muted-foreground">Mobile Number (Optional)</label>
              {isPhoneVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                  <CheckCircle className="size-3" /> Verified
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                id="reg-phone"
                ref={phoneRef}
                type="tel"
                aria-invalid={!!fieldErrors.phone}
                aria-describedby={fieldErrors.phone ? 'reg-phone-error' : undefined}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setIsPhoneVerified(false);
                  if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: '' }));
                }}
                className={`w-full rounded-xl border ${fieldErrors.phone ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 min-h-11 pr-24`}
                placeholder="+91 98765 43210"
              />
              {phone.trim().length >= 10 && !isPhoneVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="absolute right-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer"
                >
                  {isSendingOtp ? 'Sending...' : 'Verify OTP'}
                </button>
              )}
            </div>
            <InlineFieldError id="reg-phone-error" error={fieldErrors.phone} />
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-xs font-semibold text-muted-foreground mb-1.5">Password *</label>
            <input
              id="reg-password"
              ref={passwordRef}
              type="password"
              required
              minLength={8}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'reg-password-error' : undefined}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
              }}
              className={`w-full rounded-xl border ${fieldErrors.password ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 min-h-11`}
              placeholder="At least 8 characters"
            />
            <InlineFieldError id="reg-password-error" error={fieldErrors.password} />
          </div>

          <div>
            <label htmlFor="reg-confirm-password" className="block text-xs font-semibold text-muted-foreground mb-1.5">Confirm Password *</label>
            <input
              id="reg-confirm-password"
              ref={confirmPasswordRef}
              type="password"
              required
              aria-invalid={!!fieldErrors.password_confirmation}
              aria-describedby={fieldErrors.password_confirmation ? 'reg-confirm-password-error' : undefined}
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
                if (fieldErrors.password_confirmation) setFieldErrors((prev) => ({ ...prev, password_confirmation: '' }));
              }}
              className={`w-full rounded-xl border ${fieldErrors.password_confirmation ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 min-h-11`}
              placeholder="Repeat password"
            />
            <InlineFieldError id="reg-confirm-password-error" error={fieldErrors.password_confirmation} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isSendingOtp}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 shadow-md min-h-12 cursor-pointer"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'} <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/30">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline ml-1">
            Sign in
          </Link>
        </div>
      </div>

      {/* MSG91 OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        phone={phone}
        purpose="signup"
        initialSessionToken={otpSessionToken || undefined}
        onVerified={handleOtpVerified}
      />
    </div>
  );
}

