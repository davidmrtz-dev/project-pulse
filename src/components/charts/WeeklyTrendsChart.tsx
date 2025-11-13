import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';
import type { WeeklyTrend } from '../../types';
import { LoadingSpinner } from '../Loading';
import { ErrorCard } from '../Error';

type WeeklyTrendsChartProps = {
  data: WeeklyTrend[];
  previousData?: WeeklyTrend[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onDataPointClick?: (payload: WeeklyTrend) => void;
};

export function WeeklyTrendsChart({ data, previousData, loading, error, onRetry, onDataPointClick }: WeeklyTrendsChartProps) {
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

  const previousColors = {
    completed: isDark ? '#80DEEA' : '#80DEEA',
    inProgress: isDark ? '#90CAF9' : '#90CAF9',
    blocked: isDark ? '#FFAB91' : '#FFAB91',
  };

  const combinedData = previousData && previousData.length > 0
    ? data.map((item, index) => ({
        week: item.week,
        completed: item.completed,
        inProgress: item.inProgress,
        blocked: item.blocked,
        previousCompleted: previousData[index]?.completed || 0,
        previousInProgress: previousData[index]?.inProgress || 0,
        previousBlocked: previousData[index]?.blocked || 0,
      }))
    : data;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={combinedData}
        onClick={(chartData) => {
          if (chartData && chartData.activePayload && chartData.activePayload[0] && onDataPointClick) {
            const payload = chartData.activePayload[0].payload;
            onDataPointClick({
              week: payload.week,
              completed: payload.completed || 0,
              inProgress: payload.inProgress || 0,
              blocked: payload.blocked || 0,
            });
          }
        }}
        style={{ cursor: onDataPointClick ? 'pointer' : 'default' }}
      >
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
        <Bar dataKey="completed" stackId="a" fill={colors.completed} name="Completed (Current)" />
        <Bar dataKey="inProgress" stackId="a" fill={colors.inProgress} name="In Progress (Current)" />
        <Bar dataKey="blocked" stackId="a" fill={colors.blocked} name="Blocked (Current)" />
        {previousData && previousData.length > 0 && (
          <>
            <Bar dataKey="previousCompleted" stackId="b" fill={previousColors.completed} fillOpacity={0.5} name="Completed (Previous)" />
            <Bar dataKey="previousInProgress" stackId="b" fill={previousColors.inProgress} fillOpacity={0.5} name="In Progress (Previous)" />
            <Bar dataKey="previousBlocked" stackId="b" fill={previousColors.blocked} fillOpacity={0.5} name="Blocked (Previous)" />
          </>
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

