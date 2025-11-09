import { useState, useEffect } from 'react';
import { BaseModal } from './BaseModal';
import { useI18n } from '../../i18n/I18nProvider';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useStore } from '../../store/useStore';
import { useNotifications } from '../../lib/notifications';
import { validateProject, type ValidationError } from '../../lib/validation';
import { getErrorMessage } from '../../lib/errors';
import type { Project } from '../../types';

type ProjectFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
};

export function ProjectFormModal({ isOpen, onClose, project }: ProjectFormModalProps) {
  const { t } = useI18n();
  const { isDark: _isDark } = useDarkMode();
  const { createProject, updateProject, teamMembers } = useStore();
  const { addToast } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!project;

  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    estimatedDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'on-track' as 'on-track' | 'delayed' | 'blocked',
    progress: 0,
    tasksTotal: 0,
    tasksCompleted: 0,
    startDate: '',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        owner: project.owner,
        estimatedDate: project.estimatedDate,
        priority: project.priority,
        status: project.status,
        progress: project.progress,
        tasksTotal: project.tasksTotal ?? 0,
        tasksCompleted: project.tasksCompleted ?? 0,
        startDate: project.startDate ?? new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        name: '',
        owner: teamMembers[0]?.name ?? '',
        estimatedDate: '',
        priority: 'medium',
        status: 'on-track',
        progress: 0,
        tasksTotal: 0,
        tasksCompleted: 0,
        startDate: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
  }, [project, teamMembers]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validation = validateProject(formData);
    if (!validation.isValid) {
      const errorMap: Record<string, string> = {};
      validation.errors.forEach((err: ValidationError) => {
        const fieldName = t(`projects.columns.${err.field}`) || err.field;
        let translatedMessage = t(err.message, { field: fieldName });
        errorMap[err.field] = translatedMessage;
      });
      setErrors(errorMap);
      setLoading(false);
      return;
    }

    try {
      if (isEditing && project) {
        await updateProject(project.id, formData);
        addToast({
          type: 'success',
          message: t('projects.messages.updated'),
        });
      } else {
        await createProject(formData);
        addToast({
          type: 'success',
          message: t('projects.messages.created'),
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

  const title = isEditing ? t('projects.editTitle') : t('projects.createTitle');

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="lg"
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
            type="submit"
            form="project-form"
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary dark:bg-primary-dark text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? t('common.loading') : isEditing ? t('common.save') : t('common.create')}
          </button>
        </div>
      }
    >
      <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
            {t('projects.columns.name')} <span className="text-error dark:text-error-dark">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onFocus={(e) => e.target.select()}
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

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
            {t('projects.columns.owner')} <span className="text-error dark:text-error-dark">*</span>
          </label>
          <select
            value={formData.owner}
            onChange={(e) => handleChange('owner', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${
              errors.owner
                ? 'border-error dark:border-error-dark'
                : 'border-border dark:border-border-dark'
            } bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark`}
            required
          >
            {teamMembers.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
          {errors.owner && (
            <p className="mt-1 text-sm text-error dark:text-error-dark">{errors.owner}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
              {t('projects.columns.status')}
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
            >
              <option value="on-track">{t('projects.status.on-track')}</option>
              <option value="delayed">{t('projects.status.delayed')}</option>
              <option value="blocked">{t('projects.status.blocked')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
              {t('projects.columns.priority')}
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
            >
              <option value="high">{t('projects.priority.high')}</option>
              <option value="medium">{t('projects.priority.medium')}</option>
              <option value="low">{t('projects.priority.low')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
              {t('projects.startDate')}
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              onFocus={(e) => e.target.select()}
              className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
              {t('projects.columns.estimatedDate')} <span className="text-error dark:text-error-dark">*</span>
            </label>
            <input
              type="date"
              value={formData.estimatedDate}
              onChange={(e) => handleChange('estimatedDate', e.target.value)}
              onFocus={(e) => e.target.select()}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.estimatedDate
                  ? 'border-error dark:border-error-dark'
                  : 'border-border dark:border-border-dark'
              } bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark`}
              required
            />
            {errors.estimatedDate && (
              <p className="mt-1 text-sm text-error dark:text-error-dark">{errors.estimatedDate}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
            {t('projects.columns.progress')} (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => handleChange('progress', parseInt(e.target.value) || 0)}
            onFocus={(e) => e.target.select()}
            className={`w-full px-3 py-2 rounded-lg border ${
              errors.progress
                ? 'border-error dark:border-error-dark'
                : 'border-border dark:border-border-dark'
            } bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark`}
          />
          {errors.progress && (
            <p className="mt-1 text-sm text-error dark:text-error-dark">{errors.progress}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
              {t('projects.tasksTotal')}
            </label>
            <input
              type="number"
              min="0"
              value={formData.tasksTotal}
              onChange={(e) => handleChange('tasksTotal', parseInt(e.target.value) || 0)}
              onFocus={(e) => e.target.select()}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.tasksTotal
                  ? 'border-error dark:border-error-dark'
                  : 'border-border dark:border-border-dark'
              } bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark`}
            />
            {errors.tasksTotal && (
              <p className="mt-1 text-sm text-error dark:text-error-dark">{errors.tasksTotal}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">
              {t('projects.tasksCompleted')}
            </label>
            <input
              type="number"
              min="0"
              value={formData.tasksCompleted}
              onChange={(e) => handleChange('tasksCompleted', parseInt(e.target.value) || 0)}
              onFocus={(e) => e.target.select()}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.tasksCompleted
                  ? 'border-error dark:border-error-dark'
                  : 'border-border dark:border-border-dark'
              } bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark`}
            />
            {errors.tasksCompleted && (
              <p className="mt-1 text-sm text-error dark:text-error-dark">{errors.tasksCompleted}</p>
            )}
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

