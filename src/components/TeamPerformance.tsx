import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDarkMode } from '../hooks/useDarkMode';
import { useI18n } from '../i18n/I18nProvider';
import { useStore } from '../store/useStore';
import { useNotifications } from '../lib/notifications';
import { SkeletonCard, LoadingSpinner } from './Loading';
import { ErrorCard } from './Error';
import { TeamMemberFormModal } from './modals/TeamMemberFormModal';
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal';
import type { TeamMember } from '../types';

type TeamPerformanceProps = {
  teamMembers: TeamMember[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function TeamPerformance({ teamMembers, loading, error, onRetry }: TeamPerformanceProps) {
  const { isDark } = useDarkMode();
  const { t } = useI18n();
  const { deleteTeamMember } = useStore();
  const { addToast } = useNotifications();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorCard message={error} onRetry={onRetry} />
      </div>
    );
  }

  const chartData = teamMembers.map((member) => ({
    name: member.name.split(' ')[0], // First name only
    velocity: member.velocity,
    onTimeRate: Math.round(member.onTimeRate * 100),
    productivity: member.weeklyProductivity,
  }));

  const colors = isDark
    ? ['#1565C0', '#64B5F6', '#00E5A0', '#FFD54F', '#FF6F61', '#42A5F5']
    : ['#0D47A1', '#42A5F5', '#00C896', '#FFC107', '#EF5350', '#80DEEA'];

  const handleCreate = () => {
    setSelectedMember(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMember) return;
    
    setDeleting(true);
    try {
      await deleteTeamMember(selectedMember.id);
      addToast({
        type: 'success',
        message: t('team.messages.deleted'),
      });
      setIsDeleteModalOpen(false);
      setSelectedMember(null);
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : t('common.error'),
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Velocity Chart */}
      <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-text-primary dark:text-text-primary-dark">
            {t('team.velocity')}
          </h3>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-lg bg-primary dark:bg-primary-dark text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('team.addMember')}</span>
          </button>
        </div>
        <div className="h-64">
          {loading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <ResponsiveContainer>
              <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke={isDark ? '#B0BEC5' : '#555555'}
                tick={{ fill: isDark ? '#B0BEC5' : '#555555' }}
              />
              <YAxis
                stroke={isDark ? '#B0BEC5' : '#555555'}
                tick={{ fill: isDark ? '#B0BEC5' : '#555555' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#132F4C' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#1E3A5F' : '#E0E0E0'}`,
                  borderRadius: '0.5rem',
                  color: isDark ? '#F5F5F5' : '#1E1E1E',
                }}
              />
              <Bar dataKey="velocity" radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Team Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : teamMembers.length === 0 ? (
          <div className="col-span-full text-center py-8 text-text-secondary dark:text-text-secondary-dark">
            {t('common.noData')}
          </div>
        ) : (
          teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark relative group"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-text-primary dark:text-text-primary-dark">
                {member.name}
              </h4>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-1.5 rounded-lg hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark"
                  aria-label={t('common.edit')}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(member)}
                  className="p-1.5 rounded-lg hover:bg-error/10 dark:hover:bg-error-dark/10 transition-colors text-text-secondary dark:text-text-secondary-dark hover:text-error dark:hover:text-error-dark"
                  aria-label={t('common.delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-text-secondary-dark">{t('team.member.velocity')}</span>
                <span className="font-medium text-text-primary dark:text-text-primary-dark">
                  {member.velocity}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-text-secondary-dark">{t('team.member.onTime')}</span>
                <span className="font-medium text-success dark:text-success-dark">
                  {Math.round(member.onTimeRate * 100)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-text-secondary-dark">{t('team.member.productivity')}</span>
                <span className="font-medium text-text-primary dark:text-text-primary-dark">
                  {member.weeklyProductivity}/wk
                </span>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Modals */}
      <TeamMemberFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMember(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={t('team.deleteTitle')}
        message={t('team.deleteMessage')}
        itemName={selectedMember?.name}
        loading={deleting}
      />
    </div>
  );
}

