import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

interface NotificationState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useNotifications = create<NotificationState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove after duration (default 3 seconds)
    const duration = toast.duration ?? 3000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

