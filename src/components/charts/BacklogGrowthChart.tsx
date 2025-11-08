import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';
import type { BacklogData } from '../../types';
import { LoadingSpinner } from '../Loading';
import { ErrorCard } from '../Error';

type BacklogGrowthChartProps = {
  data: BacklogData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function BacklogGrowthChart({ data, loading, error, onRetry }: BacklogGrowthChartProps) {
  const { isDark } = useDarkMode();

  if (error) {
    return <ErrorCard message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
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
        <Legend
          wrapperStyle={{
            color: isDark ? '#F5F5F5' : '#1E1E1E',
          }}
        />
        <Area
          type="monotone"
          dataKey="backlog"
          fill={isDark ? '#FF6F61' : '#EF5350'}
          fillOpacity={0.3}
          stroke={isDark ? '#FF6F61' : '#EF5350'}
          name="Backlog"
        />
        <Line
          type="monotone"
          dataKey="completed"
          stroke={isDark ? '#00E5A0' : '#00C896'}
          strokeWidth={2}
          name="Completed"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

