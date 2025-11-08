import { X } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { useDarkMode } from '../hooks/useDarkMode';

type DrillDownData = {
  title: string;
  type: 'month' | 'week' | 'project' | 'team';
  data: Record<string, any>;
  metadata?: Record<string, string>;
};

type DrillDownModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: DrillDownData | null;
};

export function DrillDownModal({ isOpen, onClose, data }: DrillDownModalProps) {
  const { t } = useI18n();
  const { isDark: _isDark } = useDarkMode(); // Force re-render when theme changes

  if (!isOpen || !data) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-xl border border-border dark:border-border-dark w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col ${
            isOpen ? 'animate-in fade-in zoom-in-95' : ''
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border dark:border-border-dark">
            <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">
              {data.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Metadata */}
              {data.metadata && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(data.metadata).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-bg-base dark:bg-bg-base-dark rounded-lg p-3"
                    >
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark uppercase mb-1">
                        {key}
                      </p>
                      <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Data Details */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-text-primary dark:text-text-primary-dark">
                  {t('drillDown.details')}
                </h3>
                <div className="bg-bg-base dark:bg-bg-base-dark rounded-lg p-4">
                  <dl className="space-y-3">
                    {Object.entries(data.data).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b border-border dark:border-border-dark last:border-0"
                      >
                        <dt className="text-sm text-text-secondary dark:text-text-secondary-dark capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </dt>
                        <dd className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                          {typeof value === 'number'
                            ? value.toLocaleString()
                            : String(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* Additional Info based on type */}
              {data.type === 'month' && (
                <div className="bg-primary/10 dark:bg-primary-dark/10 rounded-lg p-4 border border-primary/20 dark:border-primary-dark/20">
                  <p className="text-sm text-text-primary dark:text-text-primary-dark">
                    {t('drillDown.monthInfo')}
                  </p>
                </div>
              )}

              {data.type === 'week' && (
                <div className="bg-primary/10 dark:bg-primary-dark/10 rounded-lg p-4 border border-primary/20 dark:border-primary-dark/20">
                  <p className="text-sm text-text-primary dark:text-text-primary-dark">
                    {t('drillDown.weekInfo')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border dark:border-border-dark flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-primary dark:bg-primary-dark text-white hover:opacity-90 transition-opacity"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

