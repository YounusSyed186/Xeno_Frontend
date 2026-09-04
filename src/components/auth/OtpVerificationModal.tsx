import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { otpApi } from '@/api/otp.api';
import { toast } from 'sonner';
import { ShieldCheck, Loader2, RotateCw, Smartphone, CheckCircle2 } from 'lucide-react';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  purpose?: 'signup' | 'login' | 'phone_change' | 'checkout';
  onVerified: (sessionToken: string, phone: string) => void;
  initialSessionToken?: string;
  initialCooldown?: number;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  phone,
  purpose = 'signup',
  onVerified,
  initialSessionToken,
  initialCooldown = 30,
}) => {
  const [otp, setOtp] = useState('');
  const [sessionToken, setSessionToken] = useState<string | undefined>(initialSessionToken);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(initialCooldown);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialSessionToken) {
      setSessionToken(initialSessionToken);
    }
  }, [initialSessionToken]);

  // Countdown timer
  useEffect(() => {
    let timer: any;
    if (isOpen && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, cooldown]);

  // Reset when dialog opens
  useEffect(() => {
    if (isOpen) {
      setOtp('');
      setErrorMsg(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length < 4) {
      console.warn('[OtpModal:Verify] Verification attempted with incomplete OTP:', otp);
      setErrorMsg('Please enter the full verification code.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);
    console.log(`[OtpModal:Verify] Verifying OTP: "${otp}" for phone: ${phone} (session: ${sessionToken || 'none'})`);

    try {
      const res = await otpApi.verifyOtp({
        phone,
        otp,
        session_token: sessionToken,
      });

      if (res.data?.verified) {
        console.log('[OtpModal:Verify] OTP successfully verified!', res.data);
        setIsSuccess(true);
        toast.success('Phone verified successfully!');
        setTimeout(() => {
          onVerified(res.data.session_token || sessionToken || '', phone);
          onClose();
        }, 600);
      } else {
        console.warn('[OtpModal:Verify] Backend indicated unverified:', res);
        setErrorMsg(res.message || 'Verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error('[OtpModal:Verify] Verification exception:', err);
      const msg = err.message || 'Invalid verification code.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setErrorMsg(null);
    console.log(`[OtpModal:Resend] Requesting OTP resend for phone: ${phone}`);

    try {
      const res = await otpApi.resendOtp({
        phone,
        session_token: sessionToken,
      });

      console.log('[OtpModal:Resend] OTP resend response:', res);
      toast.success('Verification code resent successfully.');
      setCooldown(res.data?.cooldown_seconds || 30);
    } catch (err: any) {
      console.error('[OtpModal:Resend] OTP resend exception:', err);
      const msg = err.message || 'Failed to resend verification code.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  // Mask phone number for display
  const maskedPhone = React.useMemo(() => {
    if (!phone) return '';
    const clean = phone.replace(/\s+/g, '');
    if (clean.length < 6) return clean;
    return clean.substring(0, 3) + ' •••••• ' + clean.substring(clean.length - 4);
  }, [phone]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl border border-border/40 bg-card/95 backdrop-blur-xl p-6 sm:p-8">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            {isSuccess ? (
              <CheckCircle2 className="size-7 text-emerald-500 animate-in zoom-in" />
            ) : (
              <Smartphone className="size-7" />
            )}
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground font-display">
            {purpose === 'login' ? 'Verify to Sign In' : 'Verify Mobile Number'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            We sent a verification code to <span className="font-semibold text-foreground font-mono">{maskedPhone}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify} className="space-y-6 pt-4">
          <div className="flex flex-col items-center justify-center space-y-3">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(val) => {
                setOtp(val);
                setErrorMsg(null);
                if (val.length === 6) {
                  // Auto-submit on complete 6 digits
                  setTimeout(() => {
                    handleVerify();
                  }, 150);
                }
              }}
              autoFocus
            >
              <InputOTPGroup className="gap-1.5 sm:gap-2">
                <InputOTPSlot index={0} className="size-11 sm:size-12 rounded-xl text-base font-bold bg-surface/80 border-border/60" />
                <InputOTPSlot index={1} className="size-11 sm:size-12 rounded-xl text-base font-bold bg-surface/80 border-border/60" />
                <InputOTPSlot index={2} className="size-11 sm:size-12 rounded-xl text-base font-bold bg-surface/80 border-border/60" />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-1.5 sm:gap-2">
                <InputOTPSlot index={3} className="size-11 sm:size-12 rounded-xl text-base font-bold bg-surface/80 border-border/60" />
                <InputOTPSlot index={4} className="size-11 sm:size-12 rounded-xl text-base font-bold bg-surface/80 border-border/60" />
                <InputOTPSlot index={5} className="size-11 sm:size-12 rounded-xl text-base font-bold bg-surface/80 border-border/60" />
              </InputOTPGroup>
            </InputOTP>

            {errorMsg && (
              <p className="text-xs font-semibold text-destructive text-center animate-in fade-in">
                {errorMsg}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isVerifying || otp.length < 4 || isSuccess}
              className="w-full h-11 rounded-xl text-xs font-bold shadow-md"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Verifying Code...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 size-4 text-emerald-300" /> Verified!
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 size-4" /> Verify & Continue
                </>
              )}
            </Button>

            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Didn't receive the SMS?</span>
              {cooldown > 0 ? (
                <span className="font-mono font-medium text-foreground">
                  Resend in <span className="text-primary font-bold">{cooldown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="inline-flex items-center gap-1 font-bold text-primary hover:underline disabled:opacity-50"
                >
                  <RotateCw className={`size-3 ${isResending ? 'animate-spin' : ''}`} /> Resend Code
                </button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
