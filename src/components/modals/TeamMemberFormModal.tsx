import { useState, useEffect } from 'react';
import { BaseModal } from './BaseModal';
import { useI18n } from '../../i18n/I18nProvider';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useStore } from '../../store/useStore';
import { useNotifications } from '../../lib/notifications';
import { getErrorMessage } from '../../lib/errors';
import type { TeamMember } from '../../types';

type TeamMemberFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  member?: TeamMember | null;
};

export function TeamMemberFormModal({ isOpen, onClose, member }: TeamMemberFormModalProps) {
  const { t } = useI18n();
  const { isDark: _isDark } = useDarkMode();
  const { createTeamMember, updateTeamMember } = useStore();
  const { addToast } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!member;

  const [formData, setFormData] = useState({
    name: '',
    velocity: 0,
    onTimeRate: 0,
    weeklyProductivity: 0,
    activeProjects: 0,
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        velocity: member.velocity,
        onTimeRate: member.onTimeRate,
        weeklyProductivity: member.weeklyProductivity,
        activeProjects: member.activeProjects ?? 0,
      });
    } else {
      setFormData({
        name: '',
        velocity: 0,
        onTimeRate: 0,
        weeklyProductivity: 0,
        activeProjects: 0,
      });
    }
    setErrors({});
  }, [member]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('team.validation.nameRequired');
    }

    if (formData.velocity < 0 || formData.velocity > 100) {
      newErrors.velocity = t('team.validation.velocityRange');
    }

    if (formData.onTimeRate < 0 || formData.onTimeRate > 1) {
      newErrors.onTimeRate = t('team.validation.onTimeRateRange');
    }

    if (formData.weeklyProductivity < 0) {
      newErrors.weeklyProductivity = t('team.validation.productivityPositive');
    }

    if (formData.activeProjects < 0) {
      newErrors.activeProjects = t('team.validation.activeProjectsPositive');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (isEditing && member) {
        await updateTeamMember(member.id, formData);
        addToast({
          type: 'success',
          message: t('team.messages.updated'),
        });
      } else {
        await createTeamMember(formData);
        addToast({
          type: 'success',
          message: t('team.messages.created'),
        });
      }
      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        message: getErrorMessage(error, t),
      });
    } finally {
      setLoading(false);
    }
  };

  const title = isEditing ? t('team.editTitle') : t('team.createTitle');

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-border dark:border-border-dark text-text-primary dark:text-text-primary-dark hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            form="team-member-form"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-primary dark:bg-primary-dark text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? t('common.loading') : isEditing ? t('common.save') : t('common.create')}
          </button>
        </div>
      }
    >
      <form id="team-member-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
            {t('team.member.name')} <span className="text-error dark:text-error-dark">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${
              errors.name
                ? 'border-error dark:border-error-dark'
                : 'border-border dark:border-border-dark'
            } bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark`}
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error dark:text-error-dark">{errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
              {t('team.member.velocity')}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.velocity}
              onChange={(e) => handleChange('velocity', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.velocity
                  ? 'border-error dark:border-error-dark'
                  : 'border-border dark:border-border-dark'
              } bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark`}
            />
            {errors.velocity && (
              <p className="mt-1 text-sm text-error dark:text-error-dark">{errors.velocity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
              {t('team.member.onTime')} (0-1)
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.onTimeRate}
              onChange={(e) => handleChange('onTimeRate', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.onTimeRate
                  ? 'border-error dark:border-error-dark'
                  : 'border-border dark:border-border-dark'
              } bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark`}
            />
            {errors.onTimeRate && (
              <p className="mt-1 text-sm text-error dark:text-error-dark">{errors.onTimeRate}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
              {t('team.member.productivity')}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.weeklyProductivity}
              onChange={(e) => handleChange('weeklyProductivity', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.weeklyProductivity
                  ? 'border-error dark:border-error-dark'
                  : 'border-border dark:border-border-dark'
              } bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark`}
            />
            {errors.weeklyProductivity && (
              <p className="mt-1 text-sm text-error dark:text-error-dark">{errors.weeklyProductivity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
              {t('team.member.activeProjects')}
            </label>
            <input
              type="number"
              min="0"
              value={formData.activeProjects}
              onChange={(e) => handleChange('activeProjects', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.activeProjects
                  ? 'border-error dark:border-error-dark'
                  : 'border-border dark:border-border-dark'
              } bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark`}
            />
            {errors.activeProjects && (
              <p className="mt-1 text-sm text-error dark:text-error-dark">{errors.activeProjects}</p>
            )}
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

