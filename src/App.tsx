import { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from './hooks/useDarkMode';

type KPI = { throughput:number; cycleTimeDays:number; onTimeRate:number };
type Point = { month:number; velocity:number; completion:number };

export default function App() {
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [series, setSeries] = useState<Point[]>([]);
  const { isDark, toggle } = useDarkMode();

  useEffect(() => {
    fetch('/api/kpis').then(r => r.json()).then(setKpi);
    fetch('/api/series').then(r => r.json()).then(setSeries);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark transition-colors duration-200">
      <header className="sticky top-0 z-10 bg-bg-panel dark:bg-bg-panel-dark border-b border-border dark:border-border-dark shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">Project Pulse</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-text-secondary dark:text-text-secondary-dark">Demo · Front-end only</div>
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-warning-dark" />
              ) : (
                <Moon className="w-5 h-5 text-text-secondary" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard label="Throughput" value={kpi?.throughput ?? '—'} suffix="/wk" />
          <KpiCard label="Cycle Time" value={kpi?.cycleTimeDays ?? '—'} suffix="d" />
          <KpiCard label="On-Time Rate" value={kpi ? `${Math.round(kpi.onTimeRate*100)}%` : '—'} />
        </section>

        {/* Chart */}
        <section className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
          <h2 className="text-base font-medium mb-4 text-text-primary dark:text-text-primary-dark">Velocity (Monthly)</h2>
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
        </section>
      </main>
    </div>
  );
}

function KpiCard({ label, value, suffix }: { label:string; value:string|number; suffix?:string }) {
  return (
    <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
      <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-text-primary dark:text-text-primary-dark">
        {value} <span className="text-text-secondary dark:text-text-secondary-dark align-middle text-sm">{suffix}</span>
      </p>
    </div>
  );
}
