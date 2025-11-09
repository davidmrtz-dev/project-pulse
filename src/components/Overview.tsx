import { useEffect, useState } from 'react';
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
import { DrillDownModal } from './DrillDownModal';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPI, Point, BacklogData, WeeklyTrend, TaskStatus, ProjectStatus, TeamWorkload } from '../types';

type TrendIndicator = {
  value: number;
  isPositive: boolean;
  isNeutral: boolean;
};

function calculateTrend(current: number, previous: number | null | undefined, invert: boolean = false): TrendIndicator | null {
  if (previous === null || previous === undefined) return null;
  
  if (Math.abs(previous) < 0.01) {
    if (current > 0.01) {
      return {
        value: 100,
        isPositive: true,
        isNeutral: false,
      };
    }
    return null;
  }
  
  const change = ((current - previous) / previous) * 100;
  const isPositive = invert ? change < 0 : change > 0;
  const isNeutral = Math.abs(change) < 0.1;
  
  return {
    value: Math.abs(change),
    isPositive,
    isNeutral,
  };
}

function KpiCard({ 
  label, 
  value, 
  suffix, 
  previousValue, 
  invertTrend = false,
  showTrend = false
}: { 
  label: string; 
  value: string | number; 
  suffix?: string;
  previousValue?: number | null;
  invertTrend?: boolean;
  showTrend?: boolean;
}) {
  const numericValue = typeof value === 'number' ? value : (typeof value === 'string' && value !== '—' ? parseFloat(value.replace('%', '')) : null);
  
  const trend = showTrend && numericValue !== null && previousValue !== undefined && previousValue !== null
    ? calculateTrend(numericValue, previousValue, invertTrend)
    : null;

  const getTrendColor = () => {
    if (!trend || trend.isNeutral) return 'text-text-secondary dark:text-text-secondary-dark';
    return trend.isPositive 
      ? 'text-success dark:text-success-dark' 
      : 'text-error dark:text-error-dark';
  };

  const getTrendIcon = () => {
    if (!trend || trend.isNeutral) return Minus;
    return trend.isPositive ? TrendingUp : TrendingDown;
  };

  const TrendIcon = trend ? getTrendIcon() : Minus;

  return (
    <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
      <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">
          {value} <span className="text-text-secondary dark:text-text-secondary-dark align-middle text-sm">{suffix}</span>
        </p>
        {trend && trend.value > 0 && (
          <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor()}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{trend.value.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

type OverviewProps = {
  kpi: KPI | null;
  previousKpi: KPI | null;
  series: Point[];
  previousSeries: Point[];
  weeklyTrends: WeeklyTrend[];
  previousWeeklyTrends: WeeklyTrend[];
  backlogGrowth: BacklogData[];
  previousBacklogGrowth: BacklogData[];
  taskStatus: TaskStatus[];
  projectStatus: ProjectStatus[];
  teamWorkload: TeamWorkload[];
  comparePeriod: boolean;
  onCompareToggle: (enabled: boolean) => void;
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
  onFetchPrevious?: {
    kpi?: () => void;
    series?: () => void;
    weeklyTrends?: () => void;
    backlogGrowth?: () => void;
  };
};

type DrillDownData = {
  title: string;
  type: 'month' | 'week' | 'project' | 'team';
  data: Record<string, any>;
  metadata?: Record<string, string>;
};

export function Overview({
  kpi,
  previousKpi,
  series,
  previousSeries,
  weeklyTrends,
  previousWeeklyTrends,
  backlogGrowth,
  previousBacklogGrowth,
  taskStatus,
  projectStatus,
  teamWorkload,
  comparePeriod,
  onCompareToggle,
  loading,
  errors,
  onRetry,
  onFetchPrevious,
}: OverviewProps) {
  const { isDark } = useDarkMode();
  const { t } = useI18n();
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);

  useEffect(() => {
    if (comparePeriod && onFetchPrevious) {
      onFetchPrevious.kpi?.();
      onFetchPrevious.series?.();
      onFetchPrevious.weeklyTrends?.();
      onFetchPrevious.backlogGrowth?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparePeriod]);

  const handleChartClick = (type: 'velocity' | 'completion' | 'backlog' | 'weekly', payload: any) => {
    if (!payload) return;

    let drillDown: DrillDownData | null = null;

    switch (type) {
      case 'velocity':
        drillDown = {
          title: `${t('drillDown.velocity.title')} - ${t('drillDown.month').replace('{month}', String(payload.month))}`,
          type: 'month',
          data: {
            velocity: payload.velocity,
            month: payload.month,
          },
          metadata: {
            Period: t('drillDown.month').replace('{month}', String(payload.month)),
            'Velocity Score': `${payload.velocity}`,
          },
        };
        break;
      case 'completion':
        drillDown = {
          title: `${t('drillDown.completion.title')} - ${t('drillDown.month').replace('{month}', String(payload.month))}`,
          type: 'month',
          data: {
            completion: payload.completion,
            month: payload.month,
          },
          metadata: {
            Period: t('drillDown.month').replace('{month}', String(payload.month)),
            'Completion Rate': `${payload.completion}%`,
          },
        };
        break;
      case 'backlog':
        drillDown = {
          title: `${t('drillDown.backlog.title')} - ${t('drillDown.month').replace('{month}', String(payload.month))}`,
          type: 'month',
          data: {
            backlog: payload.backlog,
            completed: payload.completed,
            month: payload.month,
          },
          metadata: {
            Period: t('drillDown.month').replace('{month}', String(payload.month)),
            'Backlog Items': payload.backlog,
            'Completed Items': payload.completed,
          },
        };
        break;
      case 'weekly':
        drillDown = {
          title: `${t('drillDown.weekly.title')} - ${t('drillDown.week').replace('{week}', String(payload.week))}`,
          type: 'week',
          data: {
            completed: payload.completed,
            inProgress: payload.inProgress,
            blocked: payload.blocked,
            week: payload.week,
          },
          metadata: {
            Period: t('drillDown.week').replace('{week}', String(payload.week)),
            'Completed Tasks': payload.completed,
            'In Progress': payload.inProgress,
            'Blocked': payload.blocked,
          },
        };
        break;
    }

    if (drillDown) {
      setDrillDownData(drillDown);
      setIsDrillDownOpen(true);
    }
  };

  if (errors?.kpi) {
    return (
      <div className="space-y-6">
        <ErrorCard message={errors.kpi} onRetry={onRetry?.kpi} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">
          {t('overview.title')}
        </h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={comparePeriod}
            onChange={(e) => onCompareToggle(e.target.checked)}
            className="w-4 h-4 rounded border-border dark:border-border-dark text-primary dark:text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
          />
          <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-text-secondary-dark">
            <TrendingUp className="w-4 h-4" />
            <span>{t('overview.comparePeriod')}</span>
          </div>
        </label>
      </div>

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
            <KpiCard 
              label={t('overview.kpis.throughput')} 
              value={kpi?.throughput ?? '—'} 
              suffix="/wk"
              previousValue={previousKpi?.throughput}
              showTrend={comparePeriod}
            />
            <KpiCard 
              label={t('overview.kpis.cycleTime')} 
              value={kpi?.cycleTimeDays ?? '—'} 
              suffix="d"
              previousValue={previousKpi?.cycleTimeDays}
              invertTrend={true}
              showTrend={comparePeriod}
            />
            <KpiCard 
              label={t('overview.kpis.onTimeRate')} 
              value={kpi ? Math.round(kpi.onTimeRate * 100) : '—'}
              suffix="%"
              previousValue={previousKpi ? previousKpi.onTimeRate * 100 : null}
              showTrend={comparePeriod}
            />
            <KpiCard 
              label={t('overview.kpis.activeProjects')} 
              value={kpi?.activeProjects ?? '—'}
              previousValue={previousKpi?.activeProjects}
              showTrend={comparePeriod}
            />
            <KpiCard 
              label={t('overview.kpis.totalTasks')} 
              value={kpi?.totalTasks ?? '—'}
              previousValue={previousKpi?.totalTasks}
              showTrend={comparePeriod}
            />
            <KpiCard 
              label={t('overview.kpis.completedTasks')} 
              value={kpi?.completedTasks ?? '—'}
              previousValue={previousKpi?.completedTasks}
              showTrend={comparePeriod}
            />
          </>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <LineChart
                  data={series}
                  onClick={(data) => {
                    if (data && data.activePayload && data.activePayload[0]) {
                      handleChartClick('velocity', data.activePayload[0].payload);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
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
                    dot={{ r: 4, fill: isDark ? '#1565C0' : '#0D47A1', cursor: 'pointer' }}
                    activeDot={{ r: 6, cursor: 'pointer' }}
                    name={t('overview.charts.currentPeriod')}
                  />
                  {comparePeriod && previousSeries.length > 0 && (
                    <Line
                      type="monotone"
                      dataKey="velocity"
                      data={previousSeries}
                      stroke={isDark ? '#64B5F6' : '#42A5F5'}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: isDark ? '#64B5F6' : '#42A5F5', cursor: 'pointer' }}
                      activeDot={{ r: 6, cursor: 'pointer' }}
                      name={t('overview.charts.previousPeriod')}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

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
                <AreaChart
                  data={series}
                  onClick={(data) => {
                    if (data && data.activePayload && data.activePayload[0]) {
                      handleChartClick('completion', data.activePayload[0].payload);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
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
                    name={t('overview.charts.currentPeriod')}
                  />
                  {comparePeriod && previousSeries.length > 0 && (
                    <Area
                      type="monotone"
                      dataKey="completion"
                      data={previousSeries}
                      stroke={isDark ? '#80DEEA' : '#80DEEA'}
                      fill={isDark ? '#80DEEA' : '#80DEEA'}
                      fillOpacity={0.2}
                      strokeDasharray="5 5"
                      name={t('overview.charts.previousPeriod')}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
          <h2 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">
            {t('overview.charts.backlogGrowth')}
          </h2>
          <div className="h-72">
            <BacklogGrowthChart
              data={backlogGrowth}
              previousData={comparePeriod ? previousBacklogGrowth : undefined}
              loading={loading?.backlogGrowth}
              error={errors?.backlogGrowth}
              onRetry={onRetry?.backlogGrowth}
              onDataPointClick={(payload) => handleChartClick('backlog', payload)}
            />
          </div>
        </div>

        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
          <h2 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">
            {t('overview.charts.weeklyTrends')}
          </h2>
          <div className="h-72">
            <WeeklyTrendsChart
              data={weeklyTrends}
              previousData={comparePeriod ? previousWeeklyTrends : undefined}
              loading={loading?.weeklyTrends}
              error={errors?.weeklyTrends}
              onRetry={onRetry?.weeklyTrends}
              onDataPointClick={(payload) => handleChartClick('weekly', payload)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

      <DrillDownModal
        isOpen={isDrillDownOpen}
        onClose={() => {
          setIsDrillDownOpen(false);
          setDrillDownData(null);
        }}
        data={drillDownData}
      />
    </div>
  );
}

