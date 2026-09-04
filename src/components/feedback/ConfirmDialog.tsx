import React from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { AlertTriangle, AlertCircle, Trash2, X, CheckCircle } from 'lucide-react';

type ConfirmVariant = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  trigger?: React.ReactNode;
}

const variantConfig: Record<ConfirmVariant, { icon: React.ComponentType<{ className?: string }>; color: string; confirmColor: string }> = {
  danger: { icon: AlertTriangle, color: 'text-rose-500', confirmColor: 'bg-rose-500 hover:bg-rose-500/90' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', confirmColor: 'bg-amber-500 hover:bg-amber-500/90' },
  info: { icon: AlertCircle, color: 'text-sky-500', confirmColor: 'bg-sky-500 hover:bg-sky-500/90' },
  success: { icon: CheckCircle, color: 'text-emerald-500', confirmColor: 'bg-emerald-500 hover:bg-emerald-500/90' },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  trigger,
}) => {
  const { icon: Icon, color, confirmColor } = variantConfig[variant];

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  if (trigger) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-full bg-${variant}-500/10 ${color}`}>
                <Icon className="size-5" />
              </div>
              <AlertDialogTitle className="text-lg font-semibold">{title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
            <AlertDialogCancel className="w-full sm:w-auto"> {cancelLabel} </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isLoading} className={`w-full sm:w-auto ${confirmColor} text-white`}>
              {isLoading ? 'Confirming...' : confirmLabel}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full bg-${variant}-500/10 ${color}`}>
              <Icon className="size-5" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
          <AlertDialogCancel onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isLoading} className={`w-full sm:w-auto ${confirmColor} text-white`}>
            {isLoading ? 'Confirming...' : confirmLabel}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};