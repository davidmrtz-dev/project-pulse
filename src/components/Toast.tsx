import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotifications, type Toast } from '../lib/notifications';

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: 'bg-success/10 dark:bg-success-dark/10 border-success dark:border-success-dark text-success dark:text-success-dark',
  error: 'bg-error/10 dark:bg-error-dark/10 border-error dark:border-error-dark text-error dark:text-error-dark',
  info: 'bg-primary/10 dark:bg-primary-dark/10 border-primary dark:border-primary-dark text-primary dark:text-primary-dark',
  warning: 'bg-warning/10 dark:bg-warning-dark/10 border-warning dark:border-warning-dark text-warning dark:text-warning-dark',
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useNotifications();
  const Icon = toastIcons[toast.type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${toastStyles[toast.type]} animate-in slide-in-from-right fade-in shadow-lg min-w-[300px] max-w-md`}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

