import { useEffect, useState, useMemo } from 'react';
import { Moon, Sun, LayoutDashboard, FolderKanban, Users, Bell, Languages } from 'lucide-react';
import { useDarkMode } from './hooks/useDarkMode';
import { useI18n } from './i18n/I18nProvider';
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

type FilterState = {
  dateRange: string;
  team: string;
  status: string;
  priority: string;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [series, setSeries] = useState<Point[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>([]);
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    team: 'all',
    status: 'all',
    priority: 'all',
  });
  const { isDark, toggle } = useDarkMode();
  const { t, language, setLanguage } = useI18n();
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    fetch('/api/kpis').then((r) => r.json()).then(setKpi);
    fetch('/api/series').then((r) => r.json()).then(setSeries);
    fetch('/api/projects').then((r) => r.json()).then(setAllProjects);
    fetch('/api/team').then((r) => r.json()).then(setAllTeamMembers);
    fetch('/api/alerts').then((r) => r.json()).then(setAllAlerts);
  }, []);

  // Filter projects based on filter state
  const filteredProjects = useMemo(() => {
    let filtered = [...allProjects];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    // Filter by priority
    if (filters.priority !== 'all') {
      filtered = filtered.filter((p) => p.priority === filters.priority);
    }

    // Filter by team member (owner)
    if (filters.team !== 'all') {
      const teamMap: Record<string, string> = {
        sarah: 'Sarah Chen',
        marcus: 'Marcus Johnson',
        emma: 'Emma Wilson',
        david: 'David Martinez',
        lisa: 'Lisa Anderson',
        james: 'James Brown',
      };
      const ownerName = teamMap[filters.team];
      if (ownerName) {
        filtered = filtered.filter((p) => p.owner === ownerName);
      }
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();

      switch (filters.dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter((p) => {
        const projectDate = new Date(p.estimatedDate);
        return projectDate >= cutoffDate;
      });
    }

    return filtered;
  }, [allProjects, filters]);

  // Filter team members
  const filteredTeamMembers = useMemo(() => {
    if (filters.team === 'all') return allTeamMembers;

    const teamMap: Record<string, string> = {
      sarah: 'Sarah Chen',
      marcus: 'Marcus Johnson',
      emma: 'Emma Wilson',
      david: 'David Martinez',
      lisa: 'Lisa Anderson',
      james: 'James Brown',
    };
    const memberName = teamMap[filters.team];
    if (!memberName) return allTeamMembers;

    return allTeamMembers.filter((m) => m.name === memberName);
  }, [allTeamMembers, filters.team]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const tabs = [
    { id: 'overview' as Tab, label: t('tabs.overview'), icon: LayoutDashboard },
    { id: 'projects' as Tab, label: t('tabs.projects'), icon: FolderKanban },
    { id: 'team' as Tab, label: t('tabs.team'), icon: Users },
    { id: 'alerts' as Tab, label: t('tabs.alerts'), icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark transition-colors duration-200">
      <header className="sticky top-0 z-20 bg-bg-panel dark:bg-bg-panel-dark border-b border-border dark:border-border-dark shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">
              Project Pulse
            </h1>
            <div className="flex items-center gap-2">
              <Filters filters={filters} onFilterChange={handleFilterChange} />
              <div className="text-sm text-text-secondary dark:text-text-secondary-dark hidden sm:block">
                {t('common.demo')}
              </div>
              
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-2 rounded-lg hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors flex items-center gap-1"
                  aria-label="Change language"
                >
                  <Languages className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark" />
                  <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase">
                    {language}
                  </span>
                </button>
                {showLangMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowLangMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-32 bg-bg-panel dark:bg-bg-panel-dark border border-border dark:border-border-dark rounded-lg shadow-lg z-20 overflow-hidden">
                      <button
                        onClick={() => {
                          setLanguage('en');
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          language === 'en'
                            ? 'bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark'
                            : 'text-text-primary dark:text-text-primary-dark hover:bg-bg-base dark:hover:bg-bg-base-dark'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('es');
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          language === 'es'
                            ? 'bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark'
                            : 'text-text-primary dark:text-text-primary-dark hover:bg-bg-base dark:hover:bg-bg-base-dark'
                        }`}
                      >
                        Español
                      </button>
                    </div>
                  </>
                )}
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
        {activeTab === 'projects' && <ProjectsTable projects={filteredProjects} />}
        {activeTab === 'team' && <TeamPerformance teamMembers={filteredTeamMembers} />}
        {activeTab === 'alerts' && <Alerts alerts={allAlerts} />}
      </main>
    </div>
  );
}
