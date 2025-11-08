import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDarkMode } from '../hooks/useDarkMode';
import { useI18n } from '../i18n/I18nProvider';

type TeamMember = {
  id: string;
  name: string;
  velocity: number;
  onTimeRate: number;
  weeklyProductivity: number;
};

export function TeamPerformance({ teamMembers }: { teamMembers: TeamMember[] }) {
  const { isDark } = useDarkMode();
  const { t } = useI18n();

  const chartData = teamMembers.map((member) => ({
    name: member.name.split(' ')[0], // First name only
    velocity: member.velocity,
    onTimeRate: Math.round(member.onTimeRate * 100),
    productivity: member.weeklyProductivity,
  }));

  const colors = isDark
    ? ['#1565C0', '#64B5F6', '#00E5A0', '#FFD54F', '#FF6F61', '#42A5F5']
    : ['#0D47A1', '#42A5F5', '#00C896', '#FFC107', '#EF5350', '#80DEEA'];

  return (
    <div className="space-y-6">
      {/* Velocity Chart */}
      <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
        <h3 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">
          {t('team.velocity')}
        </h3>
        <div className="h-64">
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
        </div>
      </div>

      {/* Team Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark"
          >
            <h4 className="font-semibold text-text-primary dark:text-text-primary-dark mb-3">
              {member.name}
            </h4>
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
        ))}
      </div>
    </div>
  );
}

