import { AlertCircle, RefreshCw } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { useDarkMode } from '../hooks/useDarkMode';

type ErrorProps = {
  message?: string | null;
  onRetry?: () => void;
  className?: string;
};

export function ErrorMessage({ message, onRetry, className = '' }: ErrorProps) {
  const { t } = useI18n();
  const { isDark: _isDark } = useDarkMode();

  const translatedMessage = message 
    ? (message.startsWith('errors.') || message.startsWith('validation.') 
        ? t(message) 
        : message)
    : t('common.error');

  return (
    <div
      className={`bg-error/10 dark:bg-error-dark/10 border border-error dark:border-error-dark rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-error dark:text-error-dark flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-error dark:text-error-dark">
            {translatedMessage}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-error dark:bg-error-dark text-white hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              {t('common.retry')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorCard({ message, onRetry }: ErrorProps) {
  return (
    <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-6 border border-border dark:border-border-dark">
      <ErrorMessage message={message} onRetry={onRetry} />
    </div>
  );
}

