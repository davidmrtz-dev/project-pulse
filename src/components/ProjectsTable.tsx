import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { useDarkMode } from '../hooks/useDarkMode';
import { useI18n } from '../i18n/I18nProvider';

type Project = {
  id: string;
  name: string;
  owner: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'blocked';
  estimatedDate: string;
  priority: 'high' | 'medium' | 'low';
};

const columnHelper = createColumnHelper<Project>();

const statusColors = {
  'on-track': 'text-success dark:text-success-dark',
  'delayed': 'text-warning dark:text-warning-dark',
  'blocked': 'text-error dark:text-error-dark',
};

const priorityColors = {
  high: 'bg-error dark:bg-error-dark',
  medium: 'bg-warning dark:bg-warning-dark',
  low: 'bg-success dark:bg-success-dark',
};

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const { isDark } = useDarkMode();
  const { t } = useI18n();
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('projects.columns.name'),
        cell: (info) => (
          <span className="font-medium text-text-primary dark:text-text-primary-dark">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('owner', {
        header: t('projects.columns.owner'),
        cell: (info) => (
          <span className="text-text-secondary dark:text-text-secondary-dark">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('progress', {
        header: t('projects.columns.progress'),
        cell: (info) => {
          const progress = info.getValue();
          return (
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-bg-base dark:bg-bg-base-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary dark:bg-primary-dark transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-text-secondary dark:text-text-secondary-dark w-12">
                {progress}%
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: t('projects.columns.status'),
        cell: (info) => {
          const status = info.getValue();
          return (
            <span className={`capitalize ${statusColors[status]}`}>
              {t(`projects.status.${status}`)}
            </span>
          );
        },
      }),
      columnHelper.accessor('priority', {
        header: t('projects.columns.priority'),
        cell: (info) => {
          const priority = info.getValue();
          return (
            <span className={`inline-block w-2 h-2 rounded-full ${priorityColors[priority]}`} />
          );
        },
      }),
      columnHelper.accessor('estimatedDate', {
        header: t('projects.columns.estimatedDate'),
        cell: (info) => (
          <span className="text-text-secondary dark:text-text-secondary-dark">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
    ],
    [isDark, t]
  );

  const table = useReactTable({
    data: projects,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm border border-border dark:border-border-dark overflow-hidden">
      <div className="p-4 border-b border-border dark:border-border-dark flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          {t('projects.title')}
        </h2>
        <input
          type="text"
          placeholder={t('projects.searchPlaceholder')}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg border border-border dark:border-border-dark bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-border dark:border-border-dark bg-bg-base dark:bg-bg-base-dark"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-text-secondary dark:text-text-secondary-dark cursor-pointer hover:bg-bg-panel dark:hover:bg-bg-panel-dark transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="text-xs">
                          {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border dark:border-border-dark hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

