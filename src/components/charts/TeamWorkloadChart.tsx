import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';
import type { TeamWorkload } from '../../types';
import { LoadingSpinner } from '../Loading';
import { ErrorCard } from '../Error';

type TeamWorkloadChartProps = {
  data: TeamWorkload[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function TeamWorkloadChart({ data, loading, error, onRetry }: TeamWorkloadChartProps) {
  const { isDark } = useDarkMode();

  if (error) {
    return <ErrorCard message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  const chartData = data.map((item) => ({
    name: item.name.split(' ')[0], // First name only
    activeTasks: item.activeTasks,
    completedThisWeek: item.completedThisWeek,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
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
        <Legend
          wrapperStyle={{
            color: isDark ? '#F5F5F5' : '#1E1E1E',
          }}
        />
        <Bar dataKey="activeTasks" fill={isDark ? '#64B5F6' : '#42A5F5'} name="Active Tasks" radius={[8, 8, 0, 0]} />
        <Bar dataKey="completedThisWeek" fill={isDark ? '#00E5A0' : '#00C896'} name="Completed This Week" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

