import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useI18n } from '../../i18n/I18nProvider';
import type { ProjectStatus } from '../../types';
import { LoadingSpinner } from '../Loading';
import { ErrorCard } from '../Error';

type ProjectStatusChartProps = {
  data: ProjectStatus[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

const statusColors: Record<string, { light: string; dark: string }> = {
  'on-track': { light: '#00C896', dark: '#00E5A0' },
  delayed: { light: '#FFC107', dark: '#FFD54F' },
  blocked: { light: '#EF5350', dark: '#FF6F61' },
};

export function ProjectStatusChart({ data, loading, error, onRetry }: ProjectStatusChartProps) {
  const { isDark } = useDarkMode();
  const { t } = useI18n();

  if (error) {
    return <ErrorCard message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  const chartData = data.map((item) => ({
    name: t(`projects.status.${item.status}`),
    value: item.count,
    percentage: item.percentage,
    status: item.status,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical">
        <XAxis type="number" stroke={isDark ? '#B0BEC5' : '#555555'} tick={{ fill: isDark ? '#B0BEC5' : '#555555' }} />
        <YAxis
          dataKey="name"
          type="category"
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
          formatter={(value: number, _name: string, props: any) => [
            `${value} (${props.payload.percentage}%)`,
            'Projects',
          ]}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
          {chartData.map((entry, index) => {
            const color = statusColors[entry.status]?.[isDark ? 'dark' : 'light'] || '#42A5F5';
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

