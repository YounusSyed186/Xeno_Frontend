import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/stores/auth.store';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
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

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  useEffect(() => {
    setTab(authModalTab);
  }, [authModalTab]);

  useEffect(() => {
    if (isAuthenticated && authModalOpen) {
      closeAuthModal();
    }
  }, [isAuthenticated, authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: loginEmail, password: loginPassword });
      toast.success('Successfully signed in!');
      closeAuthModal();
    } catch (err: any) {
      toast.error(err.message || 'Invalid login credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        password_confirmation: regConfirmPassword,
      });
      toast.success('Account created successfully!');
      closeAuthModal();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account');
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

        {tab === 'login' ? (
          /* Sign In Form */
          <div className="space-y-5">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold tracking-tight text-white">Welcome Back</h2>
              <p className="mt-1 text-xs text-zinc-400">
                Sign in to access your custom orders, saved artwork and checkout.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-zinc-400" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#5ef046] focus:outline-none focus:ring-1 focus:ring-[#5ef046]"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="size-3.5 text-zinc-400" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#5ef046] focus:outline-none focus:ring-1 focus:ring-[#5ef046]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-[#5ef046] py-3 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95 disabled:opacity-50"
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
                className="font-bold text-[#5ef046] hover:underline"
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

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <UserIcon className="size-3.5 text-zinc-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#5ef046] focus:outline-none focus:ring-1 focus:ring-[#5ef046]"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-zinc-400" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#5ef046] focus:outline-none focus:ring-1 focus:ring-[#5ef046]"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-zinc-400" /> Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#5ef046] focus:outline-none focus:ring-1 focus:ring-[#5ef046]"
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#5ef046] focus:outline-none focus:ring-1 focus:ring-[#5ef046]"
                    placeholder="Min 8 chars"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#5ef046] focus:outline-none focus:ring-1 focus:ring-[#5ef046]"
                    placeholder="Repeat"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-[#5ef046] py-3 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95 disabled:opacity-50"
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
                className="font-bold text-[#5ef046] hover:underline"
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
