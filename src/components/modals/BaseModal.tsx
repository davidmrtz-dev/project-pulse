import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
};

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '2xl',
  showCloseButton = true,
}: BaseModalProps) {
  const { isDark: _isDark } = useDarkMode();
  
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div
          className={`bg-bg-panel dark:bg-bg-panel-dark rounded-xl sm:rounded-2xl shadow-xl border border-border dark:border-border-dark w-full ${maxWidthClasses[maxWidth]} max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border dark:border-border-dark">
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-primary-dark pr-2">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>

          {footer && (
            <div className="p-4 sm:p-6 border-t border-border dark:border-border-dark">{footer}</div>
          )}
        </div>
      </div>
    </>
  );
}

