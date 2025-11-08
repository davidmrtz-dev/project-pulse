import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Overview } from '../Overview';

// Mock the hooks
vi.mock('../../hooks/useDarkMode', () => ({
  useDarkMode: () => ({ isDark: false }),
}));

vi.mock('../../i18n/I18nProvider', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    language: 'en',
    setLanguage: vi.fn(),
  }),
}));

// Mock Recharts components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => null,
  AreaChart: ({ children }: any) => <div>{children}</div>,
  Area: () => null,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => null,
  ComposedChart: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe('KPI Cards', () => {
  it('should render KPIs without trends when comparePeriod is false', () => {
    const props = {
      kpi: {
        throughput: 127,
        cycleTimeDays: 4.3,
        onTimeRate: 0.86,
        activeProjects: 6,
        totalTasks: 610,
        completedTasks: 478,
      },
      previousKpi: null,
      series: [],
      previousSeries: [],
      weeklyTrends: [],
      previousWeeklyTrends: [],
      backlogGrowth: [],
      previousBacklogGrowth: [],
      taskStatus: [],
      projectStatus: [],
      teamWorkload: [],
      comparePeriod: false,
      onCompareToggle: vi.fn(),
      loading: {
        kpi: false,
        series: false,
        weeklyTrends: false,
        backlogGrowth: false,
        taskStatus: false,
        projectStatus: false,
        teamWorkload: false,
      },
      errors: {
        kpi: null,
        series: null,
        weeklyTrends: null,
        backlogGrowth: null,
        taskStatus: null,
        projectStatus: null,
        teamWorkload: null,
      },
      onRetry: {},
      onFetchPrevious: {},
    };

    render(<Overview {...props} />);

    // Check that KPIs are rendered
    expect(screen.getByText(/127/)).toBeInTheDocument();
    expect(screen.getByText(/4.3/)).toBeInTheDocument();
  });
});

