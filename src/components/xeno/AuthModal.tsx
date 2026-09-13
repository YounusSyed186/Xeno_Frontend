import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@/stores/auth.store';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { normalizeApiError, showErrorToast } from '@/lib/errors';
import { InlineFieldError } from '@/components/feedback/InlineFieldError';
import { Logo } from '@/components/xeno/Logo';
import { toast } from 'sonner';

export function AuthModal() {
  const {
    authModalOpen,
    authModalTab,
    closeAuthModal,
    openAuthModal,
    login,
    register,
    isAuthenticated,
  } = useAuthContext();

  const [tab, setTab] = useState<'login' | 'register'>(authModalTab);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginFieldErrors, setLoginFieldErrors] = useState<Record<string, string>>({});

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regFieldErrors, setRegFieldErrors] = useState<Record<string, string>>({});
  const [modalError, setModalError] = useState<{ title: string; message: string; action?: { label: string; onClick: () => void } } | null>(null);

  // Focus refs
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);
  const regEmailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTab(authModalTab);
    setModalError(null);
    setLoginFieldErrors({});
    setRegFieldErrors({});
  }, [authModalTab, authModalOpen]);

  useEffect(() => {
    if (isAuthenticated && authModalOpen) {
      closeAuthModal();
    }
  }, [isAuthenticated, authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFieldErrors({});
    setModalError(null);

    const errors: Record<string, string> = {};
    if (!loginEmail.trim()) errors['email'] = 'Email address is required.';
    if (!loginPassword) errors['password'] = 'Password is required.';

    if (Object.keys(errors).length > 0) {
      setLoginFieldErrors(errors);
      if (errors['email']) loginEmailRef.current?.focus();
      else if (errors['password']) loginPasswordRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: loginEmail.trim().toLowerCase(), password: loginPassword });
      toast.success('Successfully signed in!');
      closeAuthModal();
    } catch (err: any) {
      const normalized = normalizeApiError(err, 'Invalid login credentials');
      if (normalized.code === 'INVALID_CREDENTIALS') {
        setLoginFieldErrors({ email: 'Incorrect email or password.' });
        loginPasswordRef.current?.focus();
      }
      setModalError({
        title: normalized.title || 'Login Failed',
        message: normalized.message,
      });
      showErrorToast(normalized);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegFieldErrors({});
    setModalError(null);

    const errors: Record<string, string> = {};
    if (!regName.trim()) errors['name'] = 'Full name is required.';
    if (!regEmail.trim()) errors['email'] = 'Email address is required.';
    if (regPassword.length < 8) errors['password'] = 'Password must be at least 8 characters.';
    if (regPassword !== regConfirmPassword) errors['password_confirmation'] = 'Passwords do not match.';

    if (Object.keys(errors).length > 0) {
      setRegFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        phone: regPhone.trim() || undefined,
        password: regPassword,
        password_confirmation: regConfirmPassword,
      });
      toast.success('Account created successfully!');
      closeAuthModal();
    } catch (err: any) {
      const normalized = normalizeApiError(err, 'Failed to create account');

      if (normalized.code === 'EMAIL_ALREADY_EXISTS') {
        setRegFieldErrors({ email: 'This email is already registered.' });
        setModalError({
          title: 'Email already registered',
          message: 'An account with this email already exists. Please sign in instead.',
          action: {
            label: 'Switch to Sign In',
            onClick: () => {
              setLoginEmail(regEmail);
              setTab('login');
              setModalError(null);
            },
          },
        });
        regEmailRef.current?.focus();
      } else if (Object.keys(normalized.fieldErrors).length > 0) {
        setRegFieldErrors(normalized.fieldErrors);
        setModalError({
          title: 'Validation failed',
          message: normalized.message,
        });
      } else {
        setModalError({
          title: normalized.title || 'Registration failed',
          message: normalized.message,
        });
      }
      showErrorToast(normalized);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in-0 duration-300"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-black/95 p-6 sm:p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        {/* Logo Branding */}
        <div className="flex flex-col items-center justify-center mb-6 pt-2">
          <Logo variant="gradient" size="md" glow={true} />
        </div>

        {/* Header Tabs */}
        <div className="mb-6 flex rounded-full bg-white/5 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition-all ${
              tab === 'login'
                ? 'bg-[#5ef046] text-black shadow-[0_0_15px_rgba(94,240,70,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition-all ${
              tab === 'register'
                ? 'bg-[#5ef046] text-black shadow-[0_0_15px_rgba(94,240,70,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Top-Level Contextual Error Alert */}
        {modalError && (
          <div
            role="alert"
            className="mb-4 rounded-2xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-zinc-200 space-y-2 animate-in fade-in-0 duration-200"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="size-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-red-400">{modalError.title}</p>
                <p className="text-zinc-300 leading-relaxed text-[11px]">{modalError.message}</p>
              </div>
            </div>
            {modalError.action && (
              <div className="pt-1 pl-6.5">
                <button
                  type="button"
                  onClick={modalError.action.onClick}
                  className="font-bold text-[#5ef046] hover:underline text-xs cursor-pointer"
                >
                  {modalError.action.label} →
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'login' ? (
          /* Sign In Form */
          <div className="space-y-5">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold tracking-tight text-white">Welcome Back</h2>
              <p className="mt-1 text-xs text-zinc-400">
                Sign in to access your custom orders, saved artwork and checkout.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1" noValidate>
              <div>
                <label htmlFor="modal-login-email" className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-zinc-400" /> Email Address
                </label>
                <input
                  id="modal-login-email"
                  ref={loginEmailRef}
                  type="email"
                  required
                  aria-invalid={!!loginFieldErrors['email']}
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (loginFieldErrors['email']) setLoginFieldErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full rounded-2xl border ${loginFieldErrors['email'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/15 focus:border-[#5ef046] focus:ring-[#5ef046]'} bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1`}
                  placeholder="name@company.com"
                />
                <InlineFieldError error={loginFieldErrors['email']} />
              </div>

              <div>
                <label htmlFor="modal-login-password" className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="size-3.5 text-zinc-400" /> Password
                </label>
                <input
                  id="modal-login-password"
                  ref={loginPasswordRef}
                  type="password"
                  required
                  aria-invalid={!!loginFieldErrors['password']}
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginFieldErrors['password']) setLoginFieldErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  className={`w-full rounded-2xl border ${loginFieldErrors['password'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/15 focus:border-[#5ef046] focus:ring-[#5ef046]'} bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1`}
                  placeholder="••••••••"
                />
                <InlineFieldError error={loginFieldErrors['password']} />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-[#5ef046] py-3 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
                {!isSubmitting && <ArrowRight className="size-4" />}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-zinc-400">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setTab('register')}
                className="font-bold text-[#5ef046] hover:underline cursor-pointer"
              >
                Create one now
              </button>
            </div>
          </div>
        ) : (
          /* Create Account Form */
          <div className="space-y-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold tracking-tight text-white">Create Account</h2>
              <p className="mt-1 text-xs text-zinc-400">
                Join Xeno Craft for corporate gifting & custom merchandise.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 pt-1" noValidate>
              <div>
                <label htmlFor="modal-reg-name" className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <UserIcon className="size-3.5 text-zinc-400" /> Full Name
                </label>
                <input
                  id="modal-reg-name"
                  type="text"
                  required
                  aria-invalid={!!regFieldErrors['name']}
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value);
                    if (regFieldErrors['name']) setRegFieldErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  className={`w-full rounded-2xl border ${regFieldErrors['name'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/15 focus:border-[#5ef046] focus:ring-[#5ef046]'} bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1`}
                  placeholder="John Doe"
                />
                <InlineFieldError error={regFieldErrors['name']} />
              </div>

              <div>
                <label htmlFor="modal-reg-email" className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-zinc-400" /> Email Address
                </label>
                <input
                  id="modal-reg-email"
                  ref={regEmailRef}
                  type="email"
                  required
                  aria-invalid={!!regFieldErrors['email']}
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (regFieldErrors['email']) setRegFieldErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full rounded-2xl border ${regFieldErrors['email'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/15 focus:border-[#5ef046] focus:ring-[#5ef046]'} bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1`}
                  placeholder="john@example.com"
                />
                <InlineFieldError error={regFieldErrors['email']} />
              </div>

              <div>
                <label htmlFor="modal-reg-phone" className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-zinc-400" /> Phone Number (Optional)
                </label>
                <input
                  id="modal-reg-phone"
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#5ef046] focus:outline-none focus:ring-1 focus:ring-[#5ef046]"
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="modal-reg-password" className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
                  <input
                    id="modal-reg-password"
                    type="password"
                    required
                    minLength={8}
                    aria-invalid={!!regFieldErrors['password']}
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (regFieldErrors['password']) setRegFieldErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    className={`w-full rounded-2xl border ${regFieldErrors['password'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/15 focus:border-[#5ef046] focus:ring-[#5ef046]'} bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1`}
                    placeholder="Min 8 chars"
                  />
                  <InlineFieldError error={regFieldErrors['password']} />
                </div>
                <div>
                  <label htmlFor="modal-reg-confirm" className="block text-xs font-medium text-zinc-300 mb-1">Confirm Password</label>
                  <input
                    id="modal-reg-confirm"
                    type="password"
                    required
                    aria-invalid={!!regFieldErrors['password_confirmation']}
                    value={regConfirmPassword}
                    onChange={(e) => {
                      setRegConfirmPassword(e.target.value);
                      if (regFieldErrors['password_confirmation']) setRegFieldErrors((prev) => ({ ...prev, password_confirmation: '' }));
                    }}
                    className={`w-full rounded-2xl border ${regFieldErrors['password_confirmation'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/15 focus:border-[#5ef046] focus:ring-[#5ef046]'} bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1`}
                    placeholder="Repeat"
                  />
                  <InlineFieldError error={regFieldErrors['password_confirmation']} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-[#5ef046] py-3 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
                {!isSubmitting && <ShieldCheck className="size-4" />}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-zinc-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('login')}
                className="font-bold text-[#5ef046] hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
