import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { useDarkMode } from '../hooks/useDarkMode';

type FilterState = {
  dateRange: string;
  team: string;
  status: string;
  priority: string;
};

type FiltersProps = {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
};

export function Filters({ filters, onFilterChange }: FiltersProps) {
  const { t } = useI18n();
  const { isDark: _isDark } = useDarkMode(); // Force re-render when theme changes
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared = {
      dateRange: 'all',
      team: 'all',
      status: 'all',
      priority: 'all',
    };
    onFilterChange(cleared);
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== 'all').length;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border dark:border-border-dark bg-bg-panel dark:bg-bg-panel-dark text-text-primary dark:text-text-primary-dark hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors relative"
      >
        <Filter className="w-4 h-4" />
        <span>{t('filters.title')}</span>
        {activeFiltersCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary dark:bg-primary-dark text-white text-xs rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end pt-16">
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-bg-panel dark:bg-bg-panel-dark border-l border-border dark:border-border-dark shadow-xl h-full overflow-y-auto">
            <div className="sticky top-0 bg-bg-panel dark:bg-bg-panel-dark border-b border-border dark:border-border-dark p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                {t('filters.title')}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary dark:text-text-primary-dark">
                  {t('filters.dateRange')}
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                >
                  <option value="all">{t('filters.options.dateRange.all')}</option>
                  <option value="week">{t('filters.options.dateRange.week')}</option>
                  <option value="month">{t('filters.options.dateRange.month')}</option>
                  <option value="quarter">{t('filters.options.dateRange.quarter')}</option>
                  <option value="year">{t('filters.options.dateRange.year')}</option>
                </select>
              </div>

              {/* Team */}
              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary dark:text-text-primary-dark">
                  {t('filters.teamMember')}
                </label>
                <select
                  value={filters.team}
                  onChange={(e) => handleFilterChange('team', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                >
                  <option value="all">{t('filters.options.team.all')}</option>
                  <option value="sarah">Sarah Chen</option>
                  <option value="marcus">Marcus Johnson</option>
                  <option value="emma">Emma Wilson</option>
                  <option value="david">David Martinez</option>
                  <option value="lisa">Lisa Anderson</option>
                  <option value="james">James Brown</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary dark:text-text-primary-dark">
                  {t('filters.status')}
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                >
                  <option value="all">{t('filters.options.status.all')}</option>
                  <option value="on-track">{t('filters.options.status.on-track')}</option>
                  <option value="delayed">{t('filters.options.status.delayed')}</option>
                  <option value="blocked">{t('filters.options.status.blocked')}</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary dark:text-text-primary-dark">
                  {t('filters.priority')}
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                >
                  <option value="all">{t('filters.options.priority.all')}</option>
                  <option value="high">{t('filters.options.priority.high')}</option>
                  <option value="medium">{t('filters.options.priority.medium')}</option>
                  <option value="low">{t('filters.options.priority.low')}</option>
                </select>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 rounded-lg border border-border dark:border-border-dark bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark hover:bg-bg-panel dark:hover:bg-bg-panel-dark transition-colors"
                >
                  {t('filters.clearAll')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

