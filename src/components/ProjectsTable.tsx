import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useI18n } from '../i18n/I18nProvider';
import { useStore } from '../store/useStore';
import { useNotifications } from '../lib/notifications';
import { getErrorMessage } from '../lib/errors';
import { SkeletonTableRow } from './Loading';
import { ErrorCard } from './Error';
import { ProjectFormModal } from './modals/ProjectFormModal';
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal';
import type { Project } from '../types';

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

type ProjectsTableProps = {
  projects: Project[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function ProjectsTable({ projects, loading, error, onRetry }: ProjectsTableProps) {
  const { isDark } = useDarkMode();
  const { t } = useI18n();
  const { deleteProject } = useStore();
  const { addToast } = useNotifications();
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (error) {
    return (
      <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm border border-border dark:border-border-dark overflow-hidden">
        <div className="p-4 border-b border-border dark:border-border-dark">
          <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
            {t('projects.title')}
          </h2>
        </div>
        <div className="p-6">
          <ErrorCard message={error} onRetry={onRetry} />
        </div>
      </div>
    );
  }

  const handleCreate = () => {
    setSelectedProject(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;
    
    setDeleting(true);
    try {
      await deleteProject(selectedProject.id);
      addToast({
        type: 'success',
        message: t('projects.messages.deleted'),
      });
      setIsDeleteModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      addToast({
        type: 'error',
        message: getErrorMessage(error, t),
      });
    } finally {
      setDeleting(false);
    }
  };

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
      columnHelper.display({
        id: 'actions',
        header: t('projects.columns.actions'),
        cell: (info) => {
          const project = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(project)}
                className="p-1.5 rounded-lg hover:bg-bg-base dark:hover:bg-bg-base-dark transition-colors text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark"
                aria-label={t('common.edit')}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteClick(project)}
                className="p-1.5 rounded-lg hover:bg-error/10 dark:hover:bg-error-dark/10 transition-colors text-text-secondary dark:text-text-secondary-dark hover:text-error dark:hover:text-error-dark"
                aria-label={t('common.delete')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        },
      }),
    ],
    [isDark, t, handleEdit, handleDeleteClick]
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
      <div className="p-4 border-b border-border dark:border-border-dark flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          {t('projects.title')}
        </h2>
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <input
            type="text"
            placeholder={t('projects.searchPlaceholder')}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border dark:border-border-dark bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
          />
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-lg bg-primary dark:bg-primary-dark text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('projects.addProject')}</span>
          </button>
        </div>
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
            {loading ? (
              <>
                <SkeletonTableRow />
                <SkeletonTableRow />
                <SkeletonTableRow />
                <SkeletonTableRow />
                <SkeletonTableRow />
              </>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text-secondary dark:text-text-secondary-dark">
                  {t('common.noData')}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={t('projects.deleteTitle')}
        message={t('projects.deleteMessage')}
        itemName={selectedProject?.name}
        loading={deleting}
      />
    </div>
  );
}

