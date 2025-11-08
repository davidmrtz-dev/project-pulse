import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { useDarkMode } from '../hooks/useDarkMode';
import { useI18n } from '../i18n/I18nProvider';

type KPI = {
  throughput: number;
  cycleTimeDays: number;
  onTimeRate: number;
};

type Point = {
  month: number;
  velocity: number;
  completion: number;
};

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

export function Overview({ kpi, series }: { kpi: KPI | null; series: Point[] }) {
  const { isDark } = useDarkMode();
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label={t('overview.kpis.throughput')} value={kpi?.throughput ?? '—'} suffix="/wk" />
        <KpiCard label={t('overview.kpis.cycleTime')} value={kpi?.cycleTimeDays ?? '—'} suffix="d" />
        <KpiCard label={t('overview.kpis.onTimeRate')} value={kpi ? `${Math.round(kpi.onTimeRate * 100)}%` : '—'} />
      </section>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Velocity Chart */}
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
          <h2 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">
            {t('overview.charts.velocity')}
          </h2>
          <div className="h-72">
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
          </div>
        </div>

        {/* Completion Chart */}
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
          <h2 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">
            {t('overview.charts.completion')}
          </h2>
          <div className="h-72">
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
          </div>
        </div>
      </div>
    </div>
  );
}

