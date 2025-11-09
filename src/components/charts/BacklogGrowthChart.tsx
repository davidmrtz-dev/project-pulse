import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';
import type { BacklogData } from '../../types';
import { LoadingSpinner } from '../Loading';
import { ErrorCard } from '../Error';

type BacklogGrowthChartProps = {
  data: BacklogData[];
  previousData?: BacklogData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onDataPointClick?: (payload: BacklogData) => void;
};

export function BacklogGrowthChart({ data, previousData, loading, error, onRetry, onDataPointClick }: BacklogGrowthChartProps) {
  const { isDark } = useDarkMode();

  if (error) {
    return <ErrorCard message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  // Combine data for comparison - merge current and previous data into single array
  const combinedData = previousData && previousData.length > 0
    ? data.map((item, index) => ({
        month: item.month,
        backlog: item.backlog,
        completed: item.completed,
        previousBacklog: previousData[index]?.backlog || 0,
        previousCompleted: previousData[index]?.completed || 0,
      }))
    : data;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={combinedData}
        onClick={(chartData) => {
          if (chartData && chartData.activePayload && chartData.activePayload[0] && onDataPointClick) {
            const payload = chartData.activePayload[0].payload;
            onDataPointClick({
              month: payload.month,
              backlog: payload.backlog || 0,
              completed: payload.completed || 0,
            });
          }
        }}
        style={{ cursor: onDataPointClick ? 'pointer' : 'default' }}
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
          name="Backlog (Current)"
        />
        <Line
          type="monotone"
          dataKey="completed"
          stroke={isDark ? '#00E5A0' : '#00C896'}
          strokeWidth={2}
          name="Completed (Current)"
        />
        {previousData && previousData.length > 0 && (
          <>
            <Area
              type="monotone"
              dataKey="previousBacklog"
              fill={isDark ? '#FFAB91' : '#FFAB91'}
              fillOpacity={0.2}
              stroke={isDark ? '#FFAB91' : '#FFAB91'}
              strokeDasharray="5 5"
              name="Backlog (Previous)"
            />
            <Line
              type="monotone"
              dataKey="previousCompleted"
              stroke={isDark ? '#80DEEA' : '#80DEEA'}
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Completed (Previous)"
            />
          </>
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

