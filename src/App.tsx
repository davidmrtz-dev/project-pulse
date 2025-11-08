import { useEffect, useState } from 'react';
import { Moon, Sun, LayoutDashboard, FolderKanban, Users, Bell } from 'lucide-react';
import { useDarkMode } from './hooks/useDarkMode';
import { Overview } from './components/Overview';
import { ProjectsTable } from './components/ProjectsTable';
import { TeamPerformance } from './components/TeamPerformance';
import { Alerts } from './components/Alerts';
import { Filters } from './components/Filters';

type KPI = { throughput: number; cycleTimeDays: number; onTimeRate: number };
type Point = { month: number; velocity: number; completion: number };
type Project = {
  id: string;
  name: string;
  owner: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'blocked';
  estimatedDate: string;
  priority: 'high' | 'medium' | 'low';
};
type TeamMember = {
  id: string;
  name: string;
  velocity: number;
  onTimeRate: number;
  weeklyProductivity: number;
};
type Alert = {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
};

type Tab = 'overview' | 'projects' | 'team' | 'alerts';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [series, setSeries] = useState<Point[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { isDark, toggle } = useDarkMode();

  useEffect(() => {
    fetch('/api/kpis').then((r) => r.json()).then(setKpi);
    fetch('/api/series').then((r) => r.json()).then(setSeries);
    fetch('/api/projects').then((r) => r.json()).then(setProjects);
    fetch('/api/team').then((r) => r.json()).then(setTeamMembers);
    fetch('/api/alerts').then((r) => r.json()).then(setAlerts);
  }, []);

  const handleFilterChange = (filters: any) => {
    // Filter logic would go here
    console.log('Filters changed:', filters);
  };

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'projects' as Tab, label: 'Projects', icon: FolderKanban },
    { id: 'team' as Tab, label: 'Team', icon: Users },
    { id: 'alerts' as Tab, label: 'Alerts', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark transition-colors duration-200">
      <header className="sticky top-0 z-20 bg-bg-panel dark:bg-bg-panel-dark border-b border-border dark:border-border-dark shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">
              Project Pulse
            </h1>
            <div className="flex items-center gap-4">
              <Filters onFilterChange={handleFilterChange} />
              <div className="text-sm text-text-secondary dark:text-text-secondary-dark hidden sm:block">
                Demo · Front-end only
              </div>
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

          {/* Tabs Navigation */}
          <nav className="flex gap-1 -mb-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                    isActive
                      ? 'bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark border-t border-x border-border dark:border-border-dark'
                      : 'text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:bg-bg-base dark:hover:bg-bg-base-dark'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {activeTab === 'overview' && <Overview kpi={kpi} series={series} />}
        {activeTab === 'projects' && <ProjectsTable projects={projects} />}
        {activeTab === 'team' && <TeamPerformance teamMembers={teamMembers} />}
        {activeTab === 'alerts' && <Alerts alerts={alerts} />}
      </main>
    </div>
  );
}
