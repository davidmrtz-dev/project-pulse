import { BaseModal } from './BaseModal';
import { useI18n } from '../../i18n/I18nProvider';
import { useDarkMode } from '../../hooks/useDarkMode';

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  loading?: boolean;
};

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  loading = false,
}: ConfirmDeleteModalProps) {
  const { t } = useI18n();
  const { isDark: _isDark } = useDarkMode();

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
      footer={
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border dark:border-border-dark text-text-primary dark:text-text-primary-dark hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-error dark:bg-error-dark text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('common.delete')}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-text-primary dark:text-text-primary-dark">{message}</p>
        {itemName && (
          <div className="bg-error/10 dark:bg-error-dark/10 border border-error dark:border-error-dark rounded-lg p-3">
            <p className="font-medium text-error dark:text-error-dark">{itemName}</p>
          </div>
        )}
      </div>
    </BaseModal>
  );
}

