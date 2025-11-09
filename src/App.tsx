import { useEffect, useMemo, useState } from 'react';
import { Moon, Sun, LayoutDashboard, FolderKanban, Users, Bell, Languages, Download, Info } from 'lucide-react';
import { useDarkMode } from './hooks/useDarkMode';
import { useI18n } from './i18n/I18nProvider';
import { useStore } from './store/useStore';
import { Overview } from './components/Overview';
import { ProjectsTable } from './components/ProjectsTable';
import { TeamPerformance } from './components/TeamPerformance';
import { Alerts } from './components/Alerts';
import { About } from './components/About';
import { Filters } from './components/Filters';
import { ToastContainer } from './components/Toast';
import {
  exportProjectsToCSV,
  exportTeamMembersToCSV,
  exportAlertsToCSV,
  exportAllDataToCSV,
} from './lib/csvExport';

export default function App() {
  const {
    kpi,
    previousKpi,
    series,
    previousSeries,
    projects: allProjects,
    teamMembers: allTeamMembers,
    alerts: allAlerts,
    weeklyTrends,
    previousWeeklyTrends,
    backlogGrowth,
    previousBacklogGrowth,
    taskStatus,
    projectStatus,
    teamWorkload,
    activeTab,
    filters,
    comparePeriod,
    loading,
    errors,
    setActiveTab,
    setFilters,
    setComparePeriod,
    fetchAll,
    fetchKpi,
    fetchSeries,
    fetchProjects,
    fetchTeam,
    fetchAlerts,
    fetchWeeklyTrends,
    fetchBacklogGrowth,
    fetchTaskStatus,
    fetchProjectStatus,
    fetchTeamWorkload,
  } = useStore();

  const { isDark, toggle } = useDarkMode();
  const { t, language, setLanguage } = useI18n();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []); // fetchAll is stable from Zustand, no need to include in deps

  // Memoize fetch previous functions to avoid recreating them on every render
  const handleFetchPrevious = useMemo(
    () => ({
      kpi: () => fetchKpi('previous'),
      series: () => fetchSeries('previous'),
      weeklyTrends: () => fetchWeeklyTrends('previous'),
      backlogGrowth: () => fetchBacklogGrowth('previous'),
    }),
    [fetchKpi, fetchSeries, fetchWeeklyTrends, fetchBacklogGrowth]
  );

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

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleExportProjects = () => {
    exportProjectsToCSV(filteredProjects);
    setShowExportMenu(false);
  };

  const handleExportTeam = () => {
    exportTeamMembersToCSV(filteredTeamMembers);
    setShowExportMenu(false);
  };

  const handleExportAlerts = () => {
    exportAlertsToCSV(allAlerts);
    setShowExportMenu(false);
  };

  const handleExportAll = () => {
    exportAllDataToCSV({
      projects: filteredProjects,
      teamMembers: filteredTeamMembers,
      alerts: allAlerts,
      kpi,
    });
    setShowExportMenu(false);
  };

  const tabs = [
    { id: 'overview' as const, label: t('tabs.overview'), icon: LayoutDashboard },
    { id: 'projects' as const, label: t('tabs.projects'), icon: FolderKanban },
    { id: 'team' as const, label: t('tabs.team'), icon: Users },
    { id: 'alerts' as const, label: t('tabs.alerts'), icon: Bell },
    { id: 'about' as const, label: t('tabs.about'), icon: Info },
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
              {/* Only show filters in tabs where they work: projects and team */}
              {(activeTab === 'projects' || activeTab === 'team') && (
                <Filters filters={filters} onFilterChange={handleFilterChange} />
              )}
              <div className="text-sm text-text-secondary dark:text-text-secondary-dark hidden sm:block">
                {t('common.demo')}
              </div>
              
              {/* Export Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="p-2 rounded-lg hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors flex items-center gap-1"
                  aria-label={t('common.export')}
                >
                  <Download className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark" />
                  <span className="hidden sm:inline text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
                    {t('common.export')}
                  </span>
                </button>
                {showExportMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowExportMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-bg-panel dark:bg-bg-panel-dark border border-border dark:border-border-dark rounded-lg shadow-lg z-20 overflow-hidden">
                      <button
                        onClick={handleExportProjects}
                        className="w-full px-4 py-2 text-left text-sm text-text-primary dark:text-text-primary-dark hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {t('common.exportProjects')}
                      </button>
                      <button
                        onClick={handleExportTeam}
                        className="w-full px-4 py-2 text-left text-sm text-text-primary dark:text-text-primary-dark hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {t('common.exportTeam')}
                      </button>
                      <button
                        onClick={handleExportAlerts}
                        className="w-full px-4 py-2 text-left text-sm text-text-primary dark:text-text-primary-dark hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {t('common.exportAlerts')}
                      </button>
                      <div className="border-t border-border dark:border-border-dark" />
                      <button
                        onClick={handleExportAll}
                        className="w-full px-4 py-2 text-left text-sm font-medium text-primary dark:text-primary-dark hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {t('common.exportAll')}
                      </button>
                    </div>
                  </>
                )}
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
        {activeTab === 'overview' && (
          <Overview
            kpi={kpi}
            previousKpi={previousKpi}
            series={series}
            previousSeries={previousSeries}
            weeklyTrends={weeklyTrends}
            previousWeeklyTrends={previousWeeklyTrends}
            backlogGrowth={backlogGrowth}
            previousBacklogGrowth={previousBacklogGrowth}
            taskStatus={taskStatus}
            projectStatus={projectStatus}
            teamWorkload={teamWorkload}
            comparePeriod={comparePeriod}
            onCompareToggle={setComparePeriod}
            loading={{
              kpi: loading.kpi,
              series: loading.series,
              weeklyTrends: loading.weeklyTrends,
              backlogGrowth: loading.backlogGrowth,
              taskStatus: loading.taskStatus,
              projectStatus: loading.projectStatus,
              teamWorkload: loading.teamWorkload,
            }}
            errors={{
              kpi: errors.kpi,
              series: errors.series,
              weeklyTrends: errors.weeklyTrends,
              backlogGrowth: errors.backlogGrowth,
              taskStatus: errors.taskStatus,
              projectStatus: errors.projectStatus,
              teamWorkload: errors.teamWorkload,
            }}
            onRetry={{
              kpi: fetchKpi,
              series: fetchSeries,
              weeklyTrends: fetchWeeklyTrends,
              backlogGrowth: fetchBacklogGrowth,
              taskStatus: fetchTaskStatus,
              projectStatus: fetchProjectStatus,
              teamWorkload: fetchTeamWorkload,
            }}
            onFetchPrevious={handleFetchPrevious}
          />
        )}
        {activeTab === 'projects' && (
          <ProjectsTable
            projects={filteredProjects}
            loading={loading.projects}
            error={errors.projects}
            onRetry={fetchProjects}
          />
        )}
        {activeTab === 'team' && (
          <TeamPerformance
            teamMembers={filteredTeamMembers}
            loading={loading.team}
            error={errors.team}
            onRetry={fetchTeam}
          />
        )}
        {activeTab === 'alerts' && (
          <Alerts
            alerts={allAlerts}
            loading={loading.alerts}
            error={errors.alerts}
            onRetry={fetchAlerts}
          />
        )}
        {activeTab === 'about' && <About />}
      </main>
      <ToastContainer />
    </div>
  );
}
