import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { useDarkMode } from '../hooks/useDarkMode';
import { useI18n } from '../i18n/I18nProvider';
import { SkeletonCard, LoadingSpinner } from './Loading';
import { ErrorCard } from './Error';
import { BacklogGrowthChart } from './charts/BacklogGrowthChart';
import { WeeklyTrendsChart } from './charts/WeeklyTrendsChart';
import { TaskStatusChart } from './charts/TaskStatusChart';
import { ProjectStatusChart } from './charts/ProjectStatusChart';
import { TeamWorkloadChart } from './charts/TeamWorkloadChart';
import type { KPI, Point, BacklogData, WeeklyTrend, TaskStatus, ProjectStatus, TeamWorkload } from '../types';

function KpiCard({ label, value, suffix }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
      <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-text-primary dark:text-text-primary-dark">
        {value} <span className="text-text-secondary dark:text-text-secondary-dark align-middle text-sm">{suffix}</span>
      </p>
    </div>
  );
}

type OverviewProps = {
  kpi: KPI | null;
  series: Point[];
  weeklyTrends: WeeklyTrend[];
  backlogGrowth: BacklogData[];
  taskStatus: TaskStatus[];
  projectStatus: ProjectStatus[];
  teamWorkload: TeamWorkload[];
  loading?: {
    kpi: boolean;
    series: boolean;
    weeklyTrends: boolean;
    backlogGrowth: boolean;
    taskStatus: boolean;
    projectStatus: boolean;
    teamWorkload: boolean;
  };
  errors?: {
    kpi: string | null;
    series: string | null;
    weeklyTrends: string | null;
    backlogGrowth: string | null;
    taskStatus: string | null;
    projectStatus: string | null;
    teamWorkload: string | null;
  };
  onRetry?: {
    kpi?: () => void;
    series?: () => void;
    weeklyTrends?: () => void;
    backlogGrowth?: () => void;
    taskStatus?: () => void;
    projectStatus?: () => void;
    teamWorkload?: () => void;
  };
};

export function Overview({
  kpi,
  series,
  weeklyTrends,
  backlogGrowth,
  taskStatus,
  projectStatus,
  teamWorkload,
  loading,
  errors,
  onRetry,
}: OverviewProps) {
  const { isDark } = useDarkMode();
  const { t } = useI18n();

  // Show error if KPI failed
  if (errors?.kpi) {
    return (
      <div className="space-y-6">
        <ErrorCard message={errors.kpi} onRetry={onRetry?.kpi} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading?.kpi ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <KpiCard label={t('overview.kpis.throughput')} value={kpi?.throughput ?? '—'} suffix="/wk" />
            <KpiCard label={t('overview.kpis.cycleTime')} value={kpi?.cycleTimeDays ?? '—'} suffix="d" />
            <KpiCard label={t('overview.kpis.onTimeRate')} value={kpi ? `${Math.round(kpi.onTimeRate * 100)}%` : '—'} />
            <KpiCard label={t('overview.kpis.activeProjects')} value={kpi?.activeProjects ?? '—'} />
            <KpiCard label={t('overview.kpis.totalTasks')} value={kpi?.totalTasks ?? '—'} />
            <KpiCard label={t('overview.kpis.completedTasks')} value={kpi?.completedTasks ?? '—'} />
          </>
        )}
      </section>

      {/* Charts Grid - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Velocity Chart */}
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
          <h2 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">
            {t('overview.charts.velocity')}
          </h2>
          <div className="h-72">
            {errors?.series ? (
              <ErrorCard message={errors.series} onRetry={onRetry?.series} />
            ) : loading?.series ? (
              <LoadingSpinner size="lg" />
            ) : (
              <ResponsiveContainer>
                <LineChart data={series}>
                  <XAxis
                    dataKey="month"
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
                  <Line
                    type="monotone"
                    dataKey="velocity"
                    stroke={isDark ? '#1565C0' : '#0D47A1'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Completion Chart */}
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
          <h2 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">
            {t('overview.charts.completion')}
          </h2>
          <div className="h-72">
            {errors?.series ? (
              <ErrorCard message={errors.series} onRetry={onRetry?.series} />
            ) : loading?.series ? (
              <LoadingSpinner size="lg" />
            ) : (
              <ResponsiveContainer>
                <AreaChart data={series}>
                  <XAxis
                    dataKey="month"
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
                  <Area
                    type="monotone"
                    dataKey="completion"
                    stroke={isDark ? '#00E5A0' : '#00C896'}
                    fill={isDark ? '#00E5A0' : '#00C896'}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Charts Grid - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backlog Growth Chart */}
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
          <h2 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">
            {t('overview.charts.backlogGrowth')}
          </h2>
          <div className="h-72">
            <BacklogGrowthChart
              data={backlogGrowth}
              loading={loading?.backlogGrowth}
              error={errors?.backlogGrowth}
              onRetry={onRetry?.backlogGrowth}
            />
          </div>
        </div>

        {/* Weekly Trends Chart */}
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
          <h2 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">
            {t('overview.charts.weeklyTrends')}
          </h2>
          <div className="h-72">
            <WeeklyTrendsChart
              data={weeklyTrends}
              loading={loading?.weeklyTrends}
              error={errors?.weeklyTrends}
              onRetry={onRetry?.weeklyTrends}
            />
          </div>
        </div>
      </div>

      {/* Charts Grid - Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Status Chart */}
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
          <h2 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">
            {t('overview.charts.taskStatus')}
          </h2>
          <div className="h-72">
            <TaskStatusChart
              data={taskStatus}
              loading={loading?.taskStatus}
              error={errors?.taskStatus}
              onRetry={onRetry?.taskStatus}
            />
          </div>
        </div>

        {/* Project Status Chart */}
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
          <h2 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">
            {t('overview.charts.projectStatus')}
          </h2>
          <div className="h-72">
            <ProjectStatusChart
              data={projectStatus}
              loading={loading?.projectStatus}
              error={errors?.projectStatus}
              onRetry={onRetry?.projectStatus}
            />
          </div>
        </div>

        {/* Team Workload Chart */}
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
          <h2 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">
            {t('overview.charts.teamWorkload')}
          </h2>
          <div className="h-72">
            <TeamWorkloadChart
              data={teamWorkload}
              loading={loading?.teamWorkload}
              error={errors?.teamWorkload}
              onRetry={onRetry?.teamWorkload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

