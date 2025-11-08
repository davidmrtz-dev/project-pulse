import { http, HttpResponse } from 'msw';

// Monthly series data (current period - last 12 months)
const demoSeries = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  velocity: Math.round(60 + Math.random() * 25),
  completion: Math.round(50 + Math.random() * 40),
}));

// Previous period series data (12 months before)
const previousSeries = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  velocity: Math.round(55 + Math.random() * 20),
  completion: Math.round(45 + Math.random() * 35),
}));

// Weekly trends (last 12 weeks - current period)
const weeklyTrends = Array.from({ length: 12 }, (_, i) => ({
  week: i + 1,
  completed: Math.round(20 + Math.random() * 15),
  inProgress: Math.round(15 + Math.random() * 10),
  blocked: Math.round(2 + Math.random() * 5),
}));

// Previous period weekly trends
const previousWeeklyTrends = Array.from({ length: 12 }, (_, i) => ({
  week: i + 1,
  completed: Math.round(18 + Math.random() * 12),
  inProgress: Math.round(13 + Math.random() * 8),
  blocked: Math.round(2 + Math.random() * 4),
}));

// Backlog growth over time (current period)
const backlogGrowth = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  backlog: Math.round(80 + Math.random() * 40 - i * 2),
  completed: Math.round(60 + Math.random() * 30),
}));

// Previous period backlog growth
const previousBacklogGrowth = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  backlog: Math.round(85 + Math.random() * 35 - i * 1.5),
  completed: Math.round(55 + Math.random() * 25),
}));

// Task status distribution
const taskStatusDistribution = [
  { status: 'completed', count: 342, color: '#00C896' },
  { status: 'in-progress', count: 89, color: '#42A5F5' },
  { status: 'blocked', count: 23, color: '#EF5350' },
  { status: 'todo', count: 156, color: '#FFC107' },
];

// Project status breakdown
const projectStatusBreakdown = [
  { status: 'on-track', count: 4, percentage: 67 },
  { status: 'delayed', count: 1, percentage: 17 },
  { status: 'blocked', count: 1, percentage: 16 },
];

// Team workload distribution
const teamWorkload = [
  { name: 'Sarah Chen', activeTasks: 12, completedThisWeek: 8 },
  { name: 'Marcus Johnson', activeTasks: 9, completedThisWeek: 6 },
  { name: 'Emma Wilson', activeTasks: 15, completedThisWeek: 11 },
  { name: 'David Martinez', activeTasks: 7, completedThisWeek: 4 },
  { name: 'Lisa Anderson', activeTasks: 11, completedThisWeek: 9 },
  { name: 'James Brown', activeTasks: 10, completedThisWeek: 7 },
];

const projects = [
  { id: '1', name: 'E-commerce Platform', owner: 'Sarah Chen', progress: 78, status: 'on-track', estimatedDate: '2024-03-15', priority: 'high', tasksCompleted: 156, tasksTotal: 200, startDate: '2024-01-10' },
  { id: '2', name: 'Mobile App Redesign', owner: 'Marcus Johnson', progress: 45, status: 'delayed', estimatedDate: '2024-04-20', priority: 'medium', tasksCompleted: 90, tasksTotal: 200, startDate: '2024-02-01' },
  { id: '3', name: 'API Integration', owner: 'Emma Wilson', progress: 92, status: 'on-track', estimatedDate: '2024-02-28', priority: 'high', tasksCompleted: 184, tasksTotal: 200, startDate: '2023-12-15' },
  { id: '4', name: 'Dashboard Analytics', owner: 'David Martinez', progress: 34, status: 'blocked', estimatedDate: '2024-05-10', priority: 'low', tasksCompleted: 68, tasksTotal: 200, startDate: '2024-02-20' },
  { id: '5', name: 'Security Audit', owner: 'Lisa Anderson', progress: 67, status: 'on-track', estimatedDate: '2024-03-30', priority: 'high', tasksCompleted: 134, tasksTotal: 200, startDate: '2024-01-05' },
  { id: '6', name: 'Content Migration', owner: 'James Brown', progress: 23, status: 'delayed', estimatedDate: '2024-06-15', priority: 'medium', tasksCompleted: 46, tasksTotal: 200, startDate: '2024-03-01' },
];

const teamMembers = [
  { id: '1', name: 'Sarah Chen', velocity: 28, onTimeRate: 0.94, weeklyProductivity: 32, activeProjects: 2 },
  { id: '2', name: 'Marcus Johnson', velocity: 22, onTimeRate: 0.78, weeklyProductivity: 25, activeProjects: 1 },
  { id: '3', name: 'Emma Wilson', velocity: 31, onTimeRate: 0.91, weeklyProductivity: 35, activeProjects: 3 },
  { id: '4', name: 'David Martinez', velocity: 19, onTimeRate: 0.65, weeklyProductivity: 21, activeProjects: 1 },
  { id: '5', name: 'Lisa Anderson', velocity: 26, onTimeRate: 0.88, weeklyProductivity: 29, activeProjects: 2 },
  { id: '6', name: 'James Brown', velocity: 24, onTimeRate: 0.82, weeklyProductivity: 27, activeProjects: 1 },
];

const alerts = [
  { id: '1', type: 'warning', message: '2 proyectos en riesgo de retraso', timestamp: new Date().toISOString() },
  { id: '2', type: 'error', message: 'Baja velocidad sostenida en el último sprint', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', type: 'info', message: 'Nuevo proyecto agregado: Content Migration', timestamp: new Date(Date.now() - 7200000).toISOString() },
];

export const handlers = [
  http.get('/api/kpis', () => HttpResponse.json({
    throughput: 127,
    cycleTimeDays: 4.3,
    onTimeRate: 0.86,
    activeProjects: 6,
    totalTasks: 610,
    completedTasks: 478,
  })),
  http.get('/api/series', ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'current';
    return HttpResponse.json(period === 'previous' ? previousSeries : demoSeries);
  }),
  http.get('/api/projects', () => HttpResponse.json(projects)),
  http.get('/api/team', () => HttpResponse.json(teamMembers)),
  http.get('/api/alerts', () => HttpResponse.json(alerts)),
  http.get('/api/weekly-trends', ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'current';
    return HttpResponse.json(period === 'previous' ? previousWeeklyTrends : weeklyTrends);
  }),
  http.get('/api/backlog-growth', ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'current';
    return HttpResponse.json(period === 'previous' ? previousBacklogGrowth : backlogGrowth);
  }),
  http.get('/api/task-status', () => HttpResponse.json(taskStatusDistribution)),
  http.get('/api/project-status', () => HttpResponse.json(projectStatusBreakdown)),
  http.get('/api/team-workload', () => HttpResponse.json(teamWorkload)),
];
