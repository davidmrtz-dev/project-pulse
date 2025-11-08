import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';
import type { TaskStatus } from '../../types';
import { LoadingSpinner } from '../Loading';
import { ErrorCard } from '../Error';

type TaskStatusChartProps = {
  data: TaskStatus[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function TaskStatusChart({ data, loading, error, onRetry }: TaskStatusChartProps) {
  const { isDark } = useDarkMode();

  if (error) {
    return <ErrorCard message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  const chartData = data.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' '),
    value: item.count,
    color: item.color,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
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
      </PieChart>
    </ResponsiveContainer>
  );
}

