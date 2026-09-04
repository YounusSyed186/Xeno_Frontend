import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth.store';
import { useAddresses } from '@/hooks/useAddresses';
import { useOrders } from '@/hooks/useOrders';
import { useWishlist } from '@/hooks/useWishlist';
import { useSupportTickets } from '@/hooks/useSupport';
import { useDashboardSummary } from '@/hooks/useDashboard';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, MapPin, Package, LogOut, ShieldCheck, Building2, Phone, Mail, Award, Clock, Plus, Trash2, CheckCircle2, Heart, MessageSquare, Bell, Camera, CheckCircle, Smartphone } from 'lucide-react';
import { PageContainer } from '@/components/ui';
import { CloudinaryImageUpload } from '@/components/common/CloudinaryImageUpload';
import { OtpVerificationModal } from '@/components/auth/OtpVerificationModal';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { uploadsApi } from '@/api/uploads.api';
import { otpApi } from '@/api/otp.api';
import { apiClient } from '@/api/client';

export const Route = createFileRoute('/account')({
  component: AccountComponent,
});

function AccountComponent() {
  const { user, status, initialized, logout, fetchCurrentUser } = useAuthStore();
  const { addresses, isLoading: isAddressesLoading, createAddress, deleteAddress } = useAddresses();
  const { orders, isLoading: isOrdersLoading, pagination } = useOrders({ page: 1, per_page: 10 });
  const { wishlist, items: wishlistItems, isLoading: isWishlistLoading } = useWishlist();
  const { tickets, isLoading: isSupportLoading } = useSupportTickets({ page: 1, per_page: 5 });
  const { data: dashboardSummary } = useDashboardSummary();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'wishlist' | 'support' | 'company'>('profile');
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Profile Edit State
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  // Address Form state
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Corporate Profile State
  const [companyName, setCompanyName] = useState('Acme Corporate Ltd');
  const [gstin, setGstin] = useState('36AACCB1234F1Z5');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 98765 43210');

  useEffect(() => {
    if (user?.phone) {
      setProfilePhone(user.phone);
      setContactPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (initialized && status === 'unauthenticated') {
      navigate({ to: '/login' });
    }
  }, [initialized, status, navigate]);

  if (status === 'loading' || !initialized) {
    return (
      <PageContainer breadcrumbs={[{ label: "Home", to: "/" }, { label: "My Account" }]}>
        <div className="space-y-4 text-center py-12">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs font-semibold text-muted-foreground">Loading account details...</p>
        </div>
      </PageContainer>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const summary = dashboardSummary?.summary;
  const recentOrders = dashboardSummary?.recent_orders || [];

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Account:Address] Saving address for:', fullName);
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
        is_default_shipping: addresses.length === 0,
      },
      {
        onSuccess: () => {
          setShowAddAddress(false);
          toast.success('Address saved successfully');
        },
      }
    );
  };

  const handleAvatarUploaded = async (file: File) => {
    setIsUpdatingAvatar(true);
    console.log('[Account:Avatar] Uploading avatar to Cloudinary for user:', user?.id);
    try {
      const res = await uploadsApi.uploadFile(file, `users/${user?.id}/avatar`);
      console.log('[Account:Avatar] Upload response:', res);
      if (res.data?.secure_url) {
        await apiClient('/users/me', {
          method: 'PATCH',
          body: {
            avatar: res.data.secure_url,
            avatar_public_id: res.data.public_id,
          },
        });
        await fetchCurrentUser();
        console.log('[Account:Avatar] Avatar updated in profile');
        toast.success('Profile avatar updated successfully!');
      }
    } catch (err: any) {
      console.error('[Account:Avatar] Avatar upload failed:', err);
      toast.error(err.message || 'Failed to upload profile photo');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!profilePhone || profilePhone.trim().length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSendingOtp(true);
    console.log('[Account:Phone] Requesting OTP for phone change:', profilePhone.trim());
    try {
      const res = await otpApi.sendOtp({
        phone: profilePhone.trim(),
        purpose: 'phone_change',
      });
      if (res.data?.session_token) {
        console.log('[Account:Phone] OTP sent, session token:', res.data.session_token);
        setIsOtpModalOpen(true);
        toast.success(res.message || 'Verification code sent to your phone');
      }
    } catch (err: any) {
      console.error('[Account:Phone] Send OTP failed:', err);
      toast.error(err.message || 'Failed to send OTP code');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handlePhoneOtpVerified = async (sessionToken: string, verifiedPhone: string) => {
    console.log('[Account:Phone] Verified OTP for phone:', verifiedPhone);
    try {
      await apiClient('/users/me', {
        method: 'PATCH',
        body: {
          phone: verifiedPhone,
        },
      });
      await fetchCurrentUser();
      console.log('[Account:Phone] User profile phone updated successfully');
      toast.success('Mobile number verified and updated successfully!');
    } catch (err: any) {
      console.error('[Account:Phone] Update phone in profile failed:', err);
      toast.error(err.message || 'Failed to update phone number in profile');
    }
  };

  const handleSaveCompanyInfo = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Account:Company] Corporate info saved:', { companyName, gstin, contactPhone });
    toast.success('Corporate billing details saved.');
  };

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "My Account" }
      ]}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {user?.avatar ? (
              <img
                src={getCloudinaryUrl(user.avatar, { width: 140, height: 140, crop: 'fill' })}
                alt={user.name}
                className="size-16 rounded-2xl object-cover border-2 border-primary/20 shadow-lg"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-2xl bg-accent-gradient text-primary-foreground font-bold text-2xl shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="size-5" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={isUpdatingAvatar}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUploaded(file);
                }}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{user?.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-semibold text-primary uppercase">
                <Award className="size-3" /> {(user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Customer')} Client
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{user?.email} • Member since {user?.created_at ? new Date(user.created_at).getFullYear() : '2026'}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="inline-flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-all w-fit"
        >
          <LogOut className="size-4" /> Log out
        </button>
      </div>

      {/* Account Overview Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel rounded-2xl p-5 border border-border/40 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Orders</span>
            <Package className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{summary?.orders_count ?? orders.length}</p>
          <p className="text-[11px] text-muted-foreground">{recentOrders.filter((o: any) => o.status === 'delivered').length} delivered successfully</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-border/40 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Lifetime Spend</span>
            <Award className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">₹{Number(summary?.total_spent ?? 0).toFixed(2)}</p>
          <p className="text-[11px] text-muted-foreground">GST Invoices available for download</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-border/40 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Saved Locations</span>
            <MapPin className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{summary?.wishlist_count ?? addresses.length}</p>
          <p className="text-[11px] text-muted-foreground">Verified shipping destinations</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-border/40 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Open Support Tickets</span>
            <MessageSquare className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{summary?.open_tickets_count ?? tickets.length}</p>
          <p className="text-[11px] text-muted-foreground">Active support conversations</p>
        </div>
      </div>

      {/* Main Account Tabs & Detail Panels */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <div className="glass-panel rounded-3xl p-3 border border-border/40 space-y-1">
            {[
              { id: 'profile', label: 'User Profile & Media', icon: User },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
              { id: 'orders', label: 'Recent Orders', icon: Package },
              { id: 'wishlist', label: 'Wishlist', icon: Heart },
              { id: 'support', label: 'Support Tickets', icon: MessageSquare },
              { id: 'company', label: 'GST & Corporate Billing', icon: Building2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground font-semibold shadow-md'
                      : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                  }`}
                >
                  <Icon className="size-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Detail Contents */}
        <div className="lg:col-span-9">
          {activeTab === 'profile' && (
            <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Personal Profile & Security</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Manage your avatar, verified mobile number, and account preferences</p>
              </div>

              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-border/40 bg-surface/40 p-5">
                <div className="relative group">
                  {user?.avatar ? (
                    <img
                      src={getCloudinaryUrl(user.avatar, { width: 160, height: 160, crop: 'fill' })}
                      alt={user.name}
                      className="size-20 rounded-2xl object-cover border-2 border-primary/20 shadow-md"
                    />
                  ) : (
                    <div className="flex size-20 items-center justify-center rounded-2xl bg-accent-gradient text-primary-foreground font-bold text-2xl shadow-md">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-sm font-semibold text-foreground">Profile Avatar (Cloudinary Media)</h3>
                  <p className="text-xs text-muted-foreground">Upload a profile photo to personalize your account</p>
                  <label className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all">
                    <Camera className="size-3.5" /> {isUpdatingAvatar ? 'Uploading...' : 'Change Photo'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={isUpdatingAvatar}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarUploaded(file);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/40 bg-surface/50 p-4 space-y-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5"><User className="size-3.5" /> Full Name</span>
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                </div>

                <div className="rounded-2xl border border-border/40 bg-surface/50 p-4 space-y-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5"><Mail className="size-3.5" /> Email Address</span>
                  <p className="text-sm font-semibold text-foreground">{user?.email}</p>
                </div>

                <div className="rounded-2xl border border-border/40 bg-surface/50 p-4 space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <Phone className="size-3.5" /> Mobile Number (MSG91 Verified)
                    </span>
                    {user?.phone_verified_at ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                        <CheckCircle className="size-3" /> Verified Mobile
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                        Unverified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="flex-1 rounded-xl border border-input bg-background/60 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      disabled={isSendingOtp || !profilePhone}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      <Smartphone className="size-3.5" /> {isSendingOtp ? 'Sending...' : 'Verify OTP'}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/40 bg-surface/50 p-4 space-y-1 sm:col-span-2">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-emerald-500" /> Account Privilege Level</span>
                  <p className="text-sm font-semibold text-foreground capitalize">{user?.role} Access</p>
                </div>
              </div>
            </div>
          )}

          {/* OTP Verification Modal */}
          <OtpVerificationModal
            isOpen={isOtpModalOpen}
            onClose={() => setIsOtpModalOpen(false)}
            phone={profilePhone}
            purpose="phone_change"
            onVerified={handlePhoneOtpVerified}
          />

          {activeTab === 'addresses' && (
            <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="size-5 text-primary" /> Delivery & Shipping Destinations
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage addresses used for seamless checkout and sample dispatch</p>
                </div>
                {!showAddAddress && (
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="size-3.5" /> Add Address
                  </button>
                )}
              </div>

              {showAddAddress && (
                <form onSubmit={handleSaveAddress} className="rounded-2xl border border-border/60 bg-surface/50 p-5 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">New Shipping Address</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Contact Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Street Address / Door / Floor"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Postal Code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Save Location</button>
                    <button type="button" onClick={() => setShowAddAddress(false)} className="rounded-xl bg-surface px-4 py-2 text-xs text-muted-foreground">Cancel</button>
                  </div>
                </form>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {addresses.map((addr: any) => (
                  <div key={addr.id} className="rounded-2xl border border-border/40 p-4 space-y-2 relative group hover:border-border transition-all">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-foreground">{addr.full_name}</p>
                      <button
                        type="button"
                        onClick={() => deleteAddress(addr.id)}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                        title="Delete Address"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{addr.address_line_1}</p>
                    <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} - {addr.postal_code}</p>
                    <p className="text-[11px] font-medium text-foreground pt-1 border-t border-border/30">Ph: {addr.phone}</p>
                  </div>
                ))}
                {addresses.length === 0 && !showAddAddress && (
                  <p className="text-xs text-muted-foreground col-span-2 py-8 text-center">No saved delivery destinations. Click "+ Add Address" to save one.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Package className="size-5 text-primary" /> Recent Custom Orders
                  </h2>
                  <p className="text-xs text-muted-foreground">View line items, production status, and download invoices</p>
                </div>
                <Link to="/orders" className="text-xs font-semibold text-primary hover:underline">
                  View Full History →
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="mx-auto size-10 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">You haven't placed any custom merchandise orders yet.</p>
                  <Link to="/products" className="inline-block rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground">
                    Browse Custom Merchandise
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order: any) => (
                    <div key={order.id} className="rounded-2xl border border-border/40 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-semibold text-foreground">Order #{order.order_number}</span>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-primary border border-primary/20">
                          {order.status}
                        </span>
                      </div>
                      <div className="divide-y divide-border/20 text-xs">
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="py-1.5 flex justify-between">
                            <span className="text-muted-foreground">{item.product_name || item.product?.name} × {item.quantity}</span>
                            <span className="font-mono font-medium text-foreground">₹{Number(item.line_total).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-border/20 flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                        <Link to="/orders/$id" params={{ id: String(order.id) }} className="font-semibold text-primary hover:underline">
                          Order Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Heart className="size-5 text-primary" /> Your Wishlist
                  </h2>
                  <p className="text-xs text-muted-foreground">Save products for later and move them to cart when ready</p>
                </div>
                <span className="text-xs text-muted-foreground">{wishlistItems.length} items</span>
              </div>

              {isWishlistLoading ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse h-64 rounded-2xl bg-surface/50" />)}
                </div>
              ) : wishlistItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart className="mx-auto size-10 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Your wishlist is empty</p>
                  <Link to="/products" className="inline-block rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {wishlistItems.map((item: any) => (
                    <div key={item.id} className="rounded-2xl border border-border/40 overflow-hidden bg-card/60">
                      <div className="aspect-4/3 overflow-hidden">
                        <img
                          src={item.product?.images?.[0]?.url || '/placeholder.png'}
                          alt={item.product?.name}
                          loading="lazy"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-foreground truncate">{item.product?.name}</h3>
                        <p className="text-sm text-muted-foreground">₹{Number(item.product?.base_price || 0).toLocaleString()}</p>
                        <div className="flex gap-2 pt-2">
                          <button className="flex-1 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Move to Cart</button>
                          <button className="rounded-xl border border-border/40 bg-surface px-4 py-2 text-xs text-muted-foreground hover:text-foreground">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'support' && (
            <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="size-5 text-primary" /> Support Tickets
                  </h2>
                  <p className="text-xs text-muted-foreground">View and manage your support conversations</p>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                  <Plus className="size-3.5" /> New Ticket
                </button>
              </div>

              {isSupportLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse h-24 rounded-xl bg-surface/50" />
                  ))}
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <MessageSquare className="mx-auto size-10 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">No support tickets yet</p>
                  <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                    <Plus className="size-3.5" /> Create Ticket
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket: any) => (
                    <div key={ticket.id} className="rounded-2xl border border-border/40 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{ticket.subject}</h3>
                          <p className="text-xs text-muted-foreground">Created {new Date(ticket.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                          {ticket.status}
                        </span>
                      </div>
                      <Link
                        to="/support"
                        className="text-xs text-[#5ef046] hover:underline font-bold"
                      >
                        View Ticket →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'company' && (
            <form onSubmit={handleSaveCompanyInfo} className="glass-panel rounded-3xl p-6 border border-border/40 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="size-5 text-primary" /> Corporate & GST Billing Profile
                </h2>
                <p className="text-xs text-muted-foreground">Add tax details for B2B GST tax credit invoicing on bulk orders</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">Registered Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">GSTIN / Tax Identification Number</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-xs uppercase text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">Accounts Contact Phone</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  Save Corporate Billing Info
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageContainer>
  );
}