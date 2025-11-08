import { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

type KPI = { throughput:number; cycleTimeDays:number; onTimeRate:number };
type Point = { month:number; velocity:number; completion:number };

export default function App() {
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [series, setSeries] = useState<Point[]>([]);

  useEffect(() => {
    fetch('/api/kpis').then(r => r.json()).then(setKpi);
    fetch('/api/series').then(r => r.json()).then(setSeries);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Project Pulse</h1>
          <div className="text-sm text-gray-500">Demo · Front-end only</div>
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
        <section className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-base font-medium mb-4">Velocity (Monthly)</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={series}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="velocity" stroke="#0D47A1" strokeWidth={2} dot={false} />
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
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">
        {value} <span className="text-gray-400 align-middle text-sm">{suffix}</span>
      </p>
    </div>
  );
}
