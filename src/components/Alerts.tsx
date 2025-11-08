import { AlertTriangle, Info, XCircle } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { useDarkMode } from '../hooks/useDarkMode';
import { LoadingSpinner } from './Loading';
import { ErrorCard } from './Error';

type Alert = {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
};

const alertIcons = {
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const alertColors = {
  warning: 'bg-warning/10 dark:bg-warning-dark/10 border-warning dark:border-warning-dark text-warning dark:text-warning-dark',
  error: 'bg-error/10 dark:bg-error-dark/10 border-error dark:border-error-dark text-error dark:text-error-dark',
  info: 'bg-primary/10 dark:bg-primary-dark/10 border-primary dark:border-primary-dark text-primary dark:text-primary-dark',
};

type AlertsProps = {
  alerts: Alert[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function Alerts({ alerts, loading, error, onRetry }: AlertsProps) {
  const { t } = useI18n();
  const { isDark: _isDark } = useDarkMode(); // Force re-render when theme changes

  if (error) {
    return <ErrorCard message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return (
      <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-6 border border-border dark:border-border-dark">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-6 border border-border dark:border-border-dark text-center">
        <p className="text-text-secondary dark:text-text-secondary-dark">
          {t('alerts.noAlerts')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
      <h2 className="text-lg font-semibold mb-4 text-text-primary dark:text-text-primary-dark">
        {t('alerts.title')}
      </h2>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = alertIcons[alert.type];
          const timeAgo = getTimeAgo(new Date(alert.timestamp), t);
          
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${alertColors[alert.type]}`}
            >
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs mt-1 opacity-75">{timeAgo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getTimeAgo(date: Date, t: (key: string) => string): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('time.justNow');
  if (diffMins < 60) return `${diffMins}${t('time.minutesAgo')}`;
  if (diffHours < 24) return `${diffHours}${t('time.hoursAgo')}`;
  return `${diffDays}${t('time.daysAgo')}`;
}

