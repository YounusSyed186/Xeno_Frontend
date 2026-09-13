import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { OtpVerificationModal } from '@/components/auth/OtpVerificationModal';
import { otpApi } from '@/api/otp.api';
import { toast } from 'sonner';
import { Sparkles, ArrowRight, Smartphone, Mail, KeyRound } from 'lucide-react';
import { Logo } from '@/components/xeno/Logo';

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): { redirect?: string | undefined } => ({
    redirect: typeof search['redirect'] === 'string' ? (search['redirect'] as string) : undefined,
  }),
  component: LoginComponent,
});

function LoginComponent() {
  const search = Route.useSearch();
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // OTP Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpSessionToken, setOtpSessionToken] = useState<string | null>(null);

  const { login, isAuthenticated, isAdmin, fetchCurrentUser } = useAuthStore();
  const navigate = useNavigate();

  const targetRedirect = search.redirect || (isAdmin ? '/admin/dashboard' : '/');

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: targetRedirect as any });
    }
  }, [isAuthenticated, targetRedirect, navigate]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    console.log('[Login:Password] Attempting login with email:', email);
    try {
      await login({ email, password });
      console.log('[Login:Password] Login successful! Navigating...');
      toast.success('Successfully logged in!');
      navigate({ to: targetRedirect as any });
    } catch (err: any) {
      console.error('[Login:Password] Login failed:', err);
      toast.error(err.message || 'Invalid login credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSendingOtp(true);
    console.log('[Login:OTP] Requesting login OTP for phone:', phone.trim());
    try {
      const res = await otpApi.sendOtp({
        phone: phone.trim(),
        purpose: 'login',
      });

      if (res.data?.session_token) {
        console.log('[Login:OTP] Received session token for login OTP:', res.data.session_token);
        setOtpSessionToken(res.data.session_token);
        setIsOtpModalOpen(true);
        toast.success(res.message || 'Verification code sent');
      }
    } catch (err: any) {
      console.error('[Login:OTP] Send OTP failed:', err);
      toast.error(err.message || 'Failed to send verification code');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpVerified = async (sessionToken: string, verifiedPhone?: string) => {
    const targetPhone = verifiedPhone || phone;
    setIsSubmitting(true);
    console.log('[Login:OTP] OTP verified. Logging into user account with session:', sessionToken);
    try {
      const res = await otpApi.loginWithOtp(targetPhone, sessionToken);
      if (res.data?.user) {
        console.log('[Login:OTP] OTP login successful for user:', res.data.user.email);
        await fetchCurrentUser();
        toast.success('Signed in successfully with Mobile OTP!');
        navigate({ to: targetRedirect as any });
      }
    } catch (err: any) {
      console.error('[Login:OTP] Final sign-in failed:', err);
      toast.error(err.message || 'Failed to sign in with OTP session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4 pt-28 sm:pt-36 pb-20">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border/40 bg-card/70 p-8 shadow-xl backdrop-blur-md">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <Logo variant="gradient" size="lg" glow={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">Welcome Back</h1>
          <p className="text-xs text-muted-foreground">Sign in to access your custom orders, saved artwork, and invoices</p>
        </div>

        {/* Method Switcher */}
        <div className="flex rounded-2xl border border-border/40 bg-surface/60 p-1">
          <button
            type="button"
            onClick={() => setLoginMethod('password')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
              loginMethod === 'password'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <KeyRound className="size-3.5" /> Password
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('otp')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
              loginMethod === 'otp'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="size-3.5" /> Mobile OTP
          </button>
        </div>

        {loginMethod === 'password' ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-11"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-muted-foreground">Password</label>
                <Link to="/contact" className="text-xs font-semibold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-11"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 shadow-md min-h-12"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In with Password'} <ArrowRight className="size-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Registered Mobile Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-11"
                placeholder="+91 98765 43210"
                autoFocus
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                We will send a 6-digit one-time verification code via SMS to your phone.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSendingOtp || isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 shadow-md min-h-12"
            >
              {isSendingOtp ? 'Sending code...' : 'Send Verification Code'} <Smartphone className="size-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/30">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline ml-1">
            Create an account
          </Link>
        </div>
      </div>

      {/* MSG91 OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        phone={phone}
        purpose="login"
        initialSessionToken={otpSessionToken || undefined}
        onVerified={handleOtpVerified}
      />
    </div>
  );
}

