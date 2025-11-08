import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';
import type { WeeklyTrend } from '../../types';
import { LoadingSpinner } from '../Loading';
import { ErrorCard } from '../Error';

type WeeklyTrendsChartProps = {
  data: WeeklyTrend[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function WeeklyTrendsChart({ data, loading, error, onRetry }: WeeklyTrendsChartProps) {
  const { isDark } = useDarkMode();

  if (error) {
    return <ErrorCard message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  const colors = {
    completed: isDark ? '#00E5A0' : '#00C896',
    inProgress: isDark ? '#64B5F6' : '#42A5F5',
    blocked: isDark ? '#FF6F61' : '#EF5350',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis
          dataKey="week"
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
        <Legend
          wrapperStyle={{
            color: isDark ? '#F5F5F5' : '#1E1E1E',
          }}
        />
        <Bar dataKey="completed" stackId="a" fill={colors.completed} name="Completed" />
        <Bar dataKey="inProgress" stackId="a" fill={colors.inProgress} name="In Progress" />
        <Bar dataKey="blocked" stackId="a" fill={colors.blocked} name="Blocked" />
      </BarChart>
    </ResponsiveContainer>
  );
}

