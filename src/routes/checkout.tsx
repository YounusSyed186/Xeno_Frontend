import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuthStore } from '@/stores/auth.store';
import { checkoutApi } from '@/api/checkout.api';
import { toast } from 'sonner';
import { CheckCircle2, MapPin, CreditCard, ShieldCheck, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { PageContainer } from '@/components/ui';
import { Skeleton } from '@/components/feedback/Skeleton';

export const Route = createFileRoute('/checkout')({
  component: CheckoutComponent,
});

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function CheckoutComponent() {
  const { cart, items, breakdown, refreshCart, isLoading: isCartLoading } = useCart();
  const { addresses, isLoading: isAddressesLoading, createAddress } = useAddresses();
  const { user, status, initialized } = useAuthStore();
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe' | 'razorpay'>('razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  // New address form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    if (initialized && status === 'unauthenticated') {
      navigate({ to: '/login', search: { redirect: '/checkout' } });
      return;
    }

    if (initialized && status === 'authenticated' && !isCartLoading && (!items || items.length === 0)) {
      navigate({ to: '/cart' });
    }
  }, [initialized, status, isCartLoading, items?.length, navigate]);

  if (isCartLoading || isAddressesLoading) {
    return (
      <PageContainer breadcrumbs={[{ label: "Home", to: "/" }, { label: "Shopping Cart", to: "/cart" }, { label: "Checkout" }]}>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton variant="rectangular" width="100%" height="220px" className="rounded-3xl" />
            <Skeleton variant="rectangular" width="100%" height="200px" className="rounded-3xl" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton variant="rectangular" width="100%" height="320px" className="rounded-3xl" />
          </div>
        </div>
      </PageContainer>
    );
  }

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    createAddress(
      {
        full_name: fullName,
        phone,
        address_line_1: line1,
        city,
        state,
        postal_code: postalCode,
        country: 'India',
        type: 'shipping',
        is_default_shipping: true,
      },
      {
        onSuccess: (data) => {
          setSelectedAddressId(data.data.address.id);
          setShowAddAddress(false);
          toast.success('Shipping address saved!');
        },
      }
    );
  };

  const handleCheckout = async () => {
    const addressId = selectedAddressId || addresses[0]?.id;
    if (!addressId) {
      toast.error('Please select or add a shipping address');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await checkoutApi.checkout({
        shipping_address_id: addressId,
        payment_method: paymentMethod,
      });

      if (!res.success || !res.data) {
        toast.error(res.message || 'Unable to place order');
        return;
      }

      const orderData = res.data.order;
      const paymentIntent = res.data.payment_intent;

      if (paymentMethod === 'razorpay' && paymentIntent?.order_id) {
        const isMock = Boolean(
          paymentIntent.mock ||
          (typeof paymentIntent.order_id === 'string' && paymentIntent.order_id.startsWith('order_mock_'))
        );
        const paymentId = (orderData as any).payments?.[0]?.id || (res.data as any).payment?.id || orderData.id;

        if (isMock) {
          toast.info('Test Environment: Completing simulated payment...');
          try {
            const verifyRes = await checkoutApi.verifyPayment(paymentId, {
              order_id: orderData.id,
              gateway: 'razorpay',
              razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(2, 12),
              razorpay_order_id: paymentIntent.order_id,
              razorpay_signature: 'sig_mock_verified',
            });

            if (verifyRes.success) {
              toast.success('Payment confirmed! Your order is in production pipeline.');
              if (typeof refreshCart === 'function') {
                refreshCart();
              }
              navigate({ to: '/orders' });
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (vErr: any) {
            toast.error(vErr.message || 'Payment verification encountered an error.');
          }
          return;
        }

        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
          return;
        }

        const rzpKey =
          paymentIntent?.key_id ||
          (res.data as any)?.payment_data?.key_id ||
          (import.meta.env as Record<string, string>)['VITE_RAZORPAY_KEY'] ||
          'rzp_test_TSYMqlKTLTRNMn';

        const options = {
          key: rzpKey,
          amount: Math.round(Number(orderData.total) * 100),
          currency: 'INR',
          name: 'Xeno Craft',
          description: `Custom Apparel Order #${orderData.order_number}`,
          order_id: paymentIntent.order_id,
          handler: async function (response: any) {
            try {
              const verifyRes = await checkoutApi.verifyPayment(paymentId, {
                order_id: orderData.id,
                gateway: 'razorpay',
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id || paymentIntent.order_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                toast.success('Payment confirmed! Your order is in production pipeline.');
                if (typeof refreshCart === 'function') {
                  refreshCart();
                }
                navigate({ to: '/orders' });
              } else {
                toast.error('Payment verification failed.');
              }
            } catch (vErr: any) {
              toast.error(vErr.message || 'Payment verification encountered an error.');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: {
            color: '#5ef046',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          console.error('Razorpay payment failed:', resp.error);
          toast.error(resp.error?.description || 'Payment was unsuccessful or cancelled.');
        });
        rzp.open();
      } else if (paymentMethod === 'stripe' && paymentIntent?.client_secret) {
        toast.info('Stripe Test Intent created. Redirecting to order summary...');
        if (typeof refreshCart === 'function') {
          refreshCart();
        }
        if (orderData?.id) {
          navigate({ to: `/orders/${orderData.id}` });
        } else {
          navigate({ to: '/orders' });
        }
      } else {
        toast.success('Order placed successfully!');
        if (typeof refreshCart === 'function') {
          refreshCart();
        }
        navigate({ to: '/orders' });
      }
    } catch (err: any) {
      toast.error(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeAddressId = selectedAddressId || addresses[0]?.id;
  const calculatedTotal = Number(breakdown?.total ?? breakdown?.grand_total ?? cart?.total ?? cart?.subtotal ?? 0).toFixed(2);
  const calculatedTax = Number(breakdown?.tax ?? breakdown?.tax_amount ?? 0).toFixed(2);
  const calculatedSubtotal = Number(breakdown?.subtotal ?? cart?.subtotal ?? 0).toFixed(2);

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Shopping Cart", to: "/cart" },
        { label: "Checkout" }
      ]}
      title="Checkout & Payment"
      description="Review delivery address and select payment gateway to complete your order"
      actions={
        <div className="flex items-center gap-2 rounded-full bg-primary/10 border border-primary/25 px-3.5 py-1.5 text-xs text-primary font-bold">
          <Sparkles className="size-3.5" /> 256-Bit SSL Encrypted
        </div>
      }
    >
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Shipping Address */}
          <div className="rounded-3xl border border-border/40 bg-card/60 p-6 sm:p-8 space-y-5 shadow-md backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border/30 pb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2.5">
                <MapPin className="size-5 text-primary" /> 1. Shipping Address
              </h2>
              {!showAddAddress && (
                <button
                  type="button"
                  onClick={() => setShowAddAddress(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <Plus className="size-3.5" /> Add New Address
                </button>
              )}
            </div>

            {showAddAddress ? (
              <form onSubmit={handleCreateAddress} className="space-y-4 pt-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Receiver name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat / House / Suite, Street Name"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-11"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">City</label>
                    <input
                      type="text"
                      required
                      placeholder="City / District"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">State</label>
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Postal Code</label>
                    <input
                      type="text"
                      required
                      placeholder="6-digit PIN"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-11"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm min-h-10"
                  >
                    Save & Use Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="rounded-xl bg-surface border border-border/60 px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all min-h-10"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((addr: any) => {
                  const isSelected = activeAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm'
                          : 'border-border/40 bg-surface/40 hover:border-border/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-foreground">{addr.full_name}</p>
                        {isSelected && <CheckCircle2 className="size-4.5 text-primary shrink-0" />}
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{addr.address_line_1}</p>
                      <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} — {addr.postal_code}</p>
                      <p className="mt-2 text-[11px] font-semibold text-foreground">Phone: {addr.phone}</p>
                    </div>
                  );
                })}
                {addresses.length === 0 && !isAddressesLoading && (
                  <div className="col-span-2 rounded-2xl border border-dashed border-border/60 p-6 text-center">
                    <p className="text-xs text-muted-foreground">No saved delivery addresses found. Please add a shipping address above.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Payment Gateway Selection */}
          <div className="rounded-3xl border border-border/40 bg-card/60 p-6 sm:p-8 space-y-5 shadow-md backdrop-blur-sm">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2.5 border-b border-border/30 pb-4">
              <CreditCard className="size-5 text-primary" /> 2. Select Payment Method
            </h2>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { id: 'razorpay', label: 'UPI & Instant Gateway', desc: 'Google Pay, PhonePe, Paytm, QR, NetBanking, Cards' },
                { id: 'stripe', label: 'Credit / Debit Card', desc: 'International Visa, Mastercard, American Express' },
                { id: 'cod', label: 'Cash on Delivery', desc: 'Pay Cash to courier agent upon order delivery' },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm'
                        : 'border-border/40 bg-surface/40 hover:border-border/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-bold text-sm text-foreground">{m.label}</p>
                        {isSelected && <CheckCircle2 className="size-4.5 text-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4">
          <div className="space-y-6 rounded-3xl border border-border/40 bg-card/60 p-6 shadow-md backdrop-blur-sm sticky top-28">
            <h2 className="text-lg font-bold text-foreground">Order Items & Summary</h2>

            <div className="divide-y divide-border/30 space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item: any) => (
                <div key={item.id} className="pt-3 flex justify-between text-xs">
                  <div>
                    <p className="font-semibold text-foreground">{item.product?.name}</p>
                    <p className="text-muted-foreground text-[11px]">
                      {item.variant ? `${item.variant.color?.name || ''} / ${item.variant.size?.name || ''} • ` : ''}Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-foreground">₹{Number(item.line_total).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 border-t border-border/30 pt-4 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">₹{calculatedSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span className="font-semibold text-foreground">₹{calculatedTax}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-400">Free Delivery</span>
              </div>
              <div className="flex justify-between border-t border-border/40 pt-3 text-base font-extrabold text-foreground">
                <span>Total Payable</span>
                <span className="text-gradient font-display text-xl">₹{calculatedTotal}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 shadow-md min-h-12"
            >
              <ShieldCheck className="size-4" />
              {isSubmitting
                ? 'Initializing Order...'
                : `Place Order — ₹${calculatedTotal}`}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Full buyer protection & instant invoice receipt</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
