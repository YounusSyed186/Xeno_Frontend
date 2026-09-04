import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminSettings, useAdminSettingsMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsComponent,
});

function AdminSettingsComponent() {
  const { data: settings = {}, isLoading } = useAdminSettings();
  const { update } = useAdminSettingsMutations();

  const [storeName, setStoreName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');

  useEffect(() => {
    if (settings) {
      setStoreName(settings['store_name'] || 'Xeno Craft');
      setSupportEmail(settings['support_email'] || 'support@xenocraft.com');
      setCurrency(settings['currency'] || 'INR');
      setLowStockThreshold(settings['low_stock_threshold'] ? String(settings['low_stock_threshold']) : '10');
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update([
      { key: 'store_name', value: storeName },
      { key: 'support_email', value: supportEmail },
      { key: 'currency', value: currency },
      { key: 'low_stock_threshold', value: lowStockThreshold },
    ]);
    toast.success('Platform settings updated');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="Platform & Store Configuration"
        description="Global operational settings, currency symbols, support channels, and inventory alert thresholds."
      />

      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 border border-border/40 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Store Brand Name</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Support Operations Email</label>
            <input
              type="email"
              required
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Base Currency Code</label>
              <input
                type="text"
                required
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Low Stock Alert Threshold</label>
              <input
                type="number"
                required
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/40 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Save className="size-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
