import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

type ZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  isZoomed: boolean;
  disabled?: boolean;
};

export function ZoomControls({ onZoomIn, onZoomOut, onReset, isZoomed, disabled }: ZoomControlsProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onZoomIn}
        disabled={disabled}
        className="p-1.5 rounded-lg hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={t('zoom.zoomIn')}
        title={t('zoom.zoomIn')}
      >
        <ZoomIn className="w-4 h-4 text-text-secondary dark:text-text-secondary-dark" />
      </button>
      <button
        onClick={onZoomOut}
        disabled={disabled}
        className="p-1.5 rounded-lg hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={t('zoom.zoomOut')}
        title={t('zoom.zoomOut')}
      >
        <ZoomOut className="w-4 h-4 text-text-secondary dark:text-text-secondary-dark" />
      </button>
      {isZoomed && (
        <button
          onClick={onReset}
          disabled={disabled}
          className="p-1.5 rounded-lg hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('zoom.reset')}
          title={t('zoom.reset')}
        >
          <RotateCcw className="w-4 h-4 text-text-secondary dark:text-text-secondary-dark" />
        </button>
      )}
    </div>
  );
}

