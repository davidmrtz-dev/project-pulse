import type { Project, TeamMember, Alert, KPI } from '../types';

/**
 * Escapa valores CSV según RFC 4180
 */
function escapeCSVValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  
  // Si contiene comillas, comas o saltos de línea, necesita ser escapado
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Convierte un array de objetos a CSV
 */
function arrayToCSV<T extends Record<string, any>>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) {
    return headers.map(h => escapeCSVValue(h.label)).join(',');
  }

  const headerRow = headers.map(h => escapeCSVValue(h.label)).join(',');
  const dataRows = data.map(item =>
    headers.map(h => escapeCSVValue(item[h.key])).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Descarga un archivo CSV
 */
function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Exporta proyectos a CSV
 */
export function exportProjectsToCSV(projects: Project[]): void {
  const headers = [
    { key: 'name' as keyof Project, label: 'Project Name' },
    { key: 'owner' as keyof Project, label: 'Owner' },
    { key: 'progress' as keyof Project, label: 'Progress (%)' },
    { key: 'status' as keyof Project, label: 'Status' },
    { key: 'priority' as keyof Project, label: 'Priority' },
    { key: 'estimatedDate' as keyof Project, label: 'Estimated Date' },
    { key: 'tasksCompleted' as keyof Project, label: 'Tasks Completed' },
    { key: 'tasksTotal' as keyof Project, label: 'Total Tasks' },
    { key: 'startDate' as keyof Project, label: 'Start Date' },
  ];

  const csv = arrayToCSV(projects, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `projects_${timestamp}.csv`);
}

/**
 * Exporta miembros del equipo a CSV
 */
export function exportTeamMembersToCSV(teamMembers: TeamMember[]): void {
  const headers = [
    { key: 'name' as keyof TeamMember, label: 'Name' },
    { key: 'velocity' as keyof TeamMember, label: 'Velocity' },
    { key: 'onTimeRate' as keyof TeamMember, label: 'On-Time Rate (%)' },
    { key: 'weeklyProductivity' as keyof TeamMember, label: 'Weekly Productivity' },
    { key: 'activeProjects' as keyof TeamMember, label: 'Active Projects' },
  ];

  const csv = arrayToCSV(teamMembers, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `team_members_${timestamp}.csv`);
}

/**
 * Exporta alertas a CSV
 */
export function exportAlertsToCSV(alerts: Alert[]): void {
  const headers = [
    { key: 'type' as keyof Alert, label: 'Type' },
    { key: 'message' as keyof Alert, label: 'Message' },
    { key: 'timestamp' as keyof Alert, label: 'Timestamp' },
  ];

  const csv = arrayToCSV(alerts, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `alerts_${timestamp}.csv`);
}

/**
 * Exporta KPIs a CSV
 */
export function exportKPIsToCSV(kpi: KPI): void {
  const csv = [
    'Metric,Value',
    `Throughput,${kpi.throughput}`,
    `Cycle Time (Days),${kpi.cycleTimeDays}`,
    `On-Time Rate (%),${kpi.onTimeRate}`,
    kpi.activeProjects !== undefined ? `Active Projects,${kpi.activeProjects}` : '',
    kpi.totalTasks !== undefined ? `Total Tasks,${kpi.totalTasks}` : '',
    kpi.completedTasks !== undefined ? `Completed Tasks,${kpi.completedTasks}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `kpis_${timestamp}.csv`);
}

/**
 * Exporta todos los datos disponibles a CSV
 */
export function exportAllDataToCSV(data: {
  projects?: Project[];
  teamMembers?: TeamMember[];
  alerts?: Alert[];
  kpi?: KPI | null;
}): void {
  const parts: string[] = [];
  const timestamp = new Date().toISOString().split('T')[0];

  if (data.projects && data.projects.length > 0) {
    parts.push('=== PROJECTS ===');
    const projectHeaders = [
      { key: 'name' as keyof Project, label: 'Project Name' },
      { key: 'owner' as keyof Project, label: 'Owner' },
      { key: 'progress' as keyof Project, label: 'Progress (%)' },
      { key: 'status' as keyof Project, label: 'Status' },
      { key: 'priority' as keyof Project, label: 'Priority' },
      { key: 'estimatedDate' as keyof Project, label: 'Estimated Date' },
    ];
    parts.push(arrayToCSV(data.projects, projectHeaders));
    parts.push('');
  }

  if (data.teamMembers && data.teamMembers.length > 0) {
    parts.push('=== TEAM MEMBERS ===');
    const teamHeaders = [
      { key: 'name' as keyof TeamMember, label: 'Name' },
      { key: 'velocity' as keyof TeamMember, label: 'Velocity' },
      { key: 'onTimeRate' as keyof TeamMember, label: 'On-Time Rate (%)' },
      { key: 'weeklyProductivity' as keyof TeamMember, label: 'Weekly Productivity' },
    ];
    parts.push(arrayToCSV(data.teamMembers, teamHeaders));
    parts.push('');
  }

  if (data.alerts && data.alerts.length > 0) {
    parts.push('=== ALERTS ===');
    const alertHeaders = [
      { key: 'type' as keyof Alert, label: 'Type' },
      { key: 'message' as keyof Alert, label: 'Message' },
      { key: 'timestamp' as keyof Alert, label: 'Timestamp' },
    ];
    parts.push(arrayToCSV(data.alerts, alertHeaders));
    parts.push('');
  }

  if (data.kpi) {
    parts.push('=== KPIs ===');
    parts.push('Metric,Value');
    parts.push(`Throughput,${data.kpi.throughput}`);
    parts.push(`Cycle Time (Days),${data.kpi.cycleTimeDays}`);
    parts.push(`On-Time Rate (%),${data.kpi.onTimeRate}`);
    if (data.kpi.activeProjects !== undefined) {
      parts.push(`Active Projects,${data.kpi.activeProjects}`);
    }
    if (data.kpi.totalTasks !== undefined) {
      parts.push(`Total Tasks,${data.kpi.totalTasks}`);
    }
    if (data.kpi.completedTasks !== undefined) {
      parts.push(`Completed Tasks,${data.kpi.completedTasks}`);
    }
  }

  const csv = parts.join('\n');
  downloadCSV(csv, `project_pulse_export_${timestamp}.csv`);
}

