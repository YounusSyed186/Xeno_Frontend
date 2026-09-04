import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { OtpVerificationModal } from '@/components/auth/OtpVerificationModal';
import { otpApi } from '@/api/otp.api';
import { toast } from 'sonner';
import { Sparkles, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';

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
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSendingOtp(true);
    try {
      console.log('[Register] Sending OTP for phone:', phone.trim());
      const res = await otpApi.sendOtp({
        phone: phone.trim(),
        purpose: 'signup',
      });

      if (res.data?.session_token) {
        setOtpSessionToken(res.data.session_token);
        setIsOtpModalOpen(true);
        toast.success(res.message || 'Verification code sent to your mobile');
      }
    } catch (err: any) {
      console.error('[Register] OTP send error:', err);
      toast.error(err.message || 'Failed to send verification code');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpVerified = (sessionToken: string) => {
    console.log('[Register] OTP verified successfully. Session token acquired.');
    setOtpSessionToken(sessionToken);
    setIsPhoneVerified(true);
    toast.success('Mobile verified successfully!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    }

    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (password !== passwordConfirmation) {
      errors.password_confirmation = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Please fix the validation errors below.');
      return;
    }

    setIsSubmitting(true);
    console.log('[Register] Submitting registration form for:', { name, email, phone: phone.trim() || undefined });

    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        otp_session_token: otpSessionToken || undefined,
        password,
        password_confirmation: passwordConfirmation,
      });
      console.log('[Register] Registration successful!');
      toast.success('Account created successfully!');
      navigate({ to: '/' });
    } catch (err: any) {
      console.error('[Register] Registration error:', err);

      if (err.errors && typeof err.errors === 'object') {
        const backendErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.errors)) {
          if (Array.isArray(msgs) && msgs.length > 0) {
            backendErrors[key] = String(msgs[0]);
          } else if (typeof msgs === 'string') {
            backendErrors[key] = msgs;
          }
        }
        setFieldErrors(backendErrors);
        toast.error(err.message || 'Validation failed. Please check the highlighted fields.');
      } else {
        toast.error(err.message || 'Failed to create account. Please try again.');
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

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
              }}
              className={`w-full rounded-xl border ${fieldErrors.name ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 min-h-11`}
              placeholder="Your full name"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-destructive font-medium">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
              }}
              className={`w-full rounded-xl border ${fieldErrors.email ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 min-h-11`}
              placeholder="name@company.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-destructive font-medium">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-muted-foreground">Mobile Number (Optional)</label>
              {isPhoneVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                  <CheckCircle className="size-3" /> Verified
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type="tel"
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
                  className="absolute right-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 text-xs font-bold transition-colors"
                >
                  {isSendingOtp ? 'Sending...' : 'Verify OTP'}
                </button>
              )}
            </div>
            {fieldErrors.phone && (
              <p className="mt-1 text-xs text-destructive font-medium">{fieldErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Password *</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
              }}
              className={`w-full rounded-xl border ${fieldErrors.password ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 min-h-11`}
              placeholder="At least 8 characters"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-destructive font-medium">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Confirm Password *</label>
            <input
              type="password"
              required
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
                if (fieldErrors.password_confirmation) setFieldErrors((prev) => ({ ...prev, password_confirmation: '' }));
              }}
              className={`w-full rounded-xl border ${fieldErrors.password_confirmation ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 min-h-11`}
              placeholder="Repeat password"
            />
            {fieldErrors.password_confirmation && (
              <p className="mt-1 text-xs text-destructive font-medium">{fieldErrors.password_confirmation}</p>
            )}
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

