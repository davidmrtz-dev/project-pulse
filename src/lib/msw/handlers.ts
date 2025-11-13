import { http, HttpResponse } from 'msw';

// Monthly series data (current period - last 24 months for more historical data)
const demoSeries = Array.from({ length: 24 }, (_, i) => {
  // Create a trend: starting lower, peaking in the middle, then stabilizing
  const trendFactor = i < 12 ? (i / 12) * 0.3 : 0.3 - ((i - 12) / 12) * 0.1;
  const baseVelocity = 55 + trendFactor * 20;
  const baseCompletion = 45 + trendFactor * 25;
  return {
    month: i + 1,
    velocity: Math.round(baseVelocity + (Math.random() - 0.5) * 15),
    completion: Math.round(baseCompletion + (Math.random() - 0.5) * 20),
  };
});

// Previous period series data (24 months before current period)
const previousSeries = Array.from({ length: 24 }, (_, i) => {
  // Lower baseline for previous period showing improvement over time
  const trendFactor = i < 12 ? (i / 12) * 0.2 : 0.2 - ((i - 12) / 12) * 0.05;
  const baseVelocity = 50 + trendFactor * 15;
  const baseCompletion = 40 + trendFactor * 20;
  return {
    month: i + 1,
    velocity: Math.round(baseVelocity + (Math.random() - 0.5) * 12),
    completion: Math.round(baseCompletion + (Math.random() - 0.5) * 18),
  };
});

// Weekly trends (last 24 weeks - current period for more historical data)
const weeklyTrends = Array.from({ length: 24 }, (_, i) => {
  // Show improvement trend over time
  const improvementFactor = (i / 24) * 0.3;
  const baseCompleted = 18 + improvementFactor * 10;
  const baseInProgress = 12 + improvementFactor * 5;
  return {
    week: i + 1,
    completed: Math.round(baseCompleted + (Math.random() - 0.5) * 8),
    inProgress: Math.round(baseInProgress + (Math.random() - 0.5) * 6),
    blocked: Math.round(2 + Math.random() * 4 + (Math.random() < 0.1 ? 3 : 0)), // Occasional spikes
  };
});

// Previous period weekly trends (24 weeks before)
const previousWeeklyTrends = Array.from({ length: 24 }, (_, i) => {
  // Lower baseline showing historical improvement
  const improvementFactor = (i / 24) * 0.2;
  const baseCompleted = 15 + improvementFactor * 8;
  const baseInProgress = 10 + improvementFactor * 4;
  return {
    week: i + 1,
    completed: Math.round(baseCompleted + (Math.random() - 0.5) * 6),
    inProgress: Math.round(baseInProgress + (Math.random() - 0.5) * 5),
    blocked: Math.round(2 + Math.random() * 3 + (Math.random() < 0.15 ? 4 : 0)), // More frequent spikes
  };
});

// Backlog growth over time (current period - 24 months)
const backlogGrowth = Array.from({ length: 24 }, (_, i) => {
  // Show backlog management improvement over time
  const reductionFactor = (i / 24) * 0.4;
  const baseBacklog = 95 - reductionFactor * 25;
  const baseCompleted = 50 + reductionFactor * 20;
  return {
    month: i + 1,
    backlog: Math.round(baseBacklog + (Math.random() - 0.5) * 15),
    completed: Math.round(baseCompleted + (Math.random() - 0.5) * 12),
  };
});

// Previous period backlog growth (24 months before)
const previousBacklogGrowth = Array.from({ length: 24 }, (_, i) => {
  // Higher baseline showing less efficient backlog management
  const reductionFactor = (i / 24) * 0.3;
  const baseBacklog = 100 - reductionFactor * 20;
  const baseCompleted = 45 + reductionFactor * 15;
  return {
    month: i + 1,
    backlog: Math.round(baseBacklog + (Math.random() - 0.5) * 12),
    completed: Math.round(baseCompleted + (Math.random() - 0.5) * 10),
  };
});

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

// Mutable projects array for CRUD operations - expanded with more historical projects
let projects = [
  // Current active projects
  { id: '1', name: 'E-commerce Platform', owner: 'Sarah Chen', progress: 78, status: 'on-track', estimatedDate: '2024-03-15', priority: 'high', tasksCompleted: 156, tasksTotal: 200, startDate: '2024-01-10' },
  { id: '2', name: 'Mobile App Redesign', owner: 'Marcus Johnson', progress: 45, status: 'delayed', estimatedDate: '2024-04-20', priority: 'medium', tasksCompleted: 90, tasksTotal: 200, startDate: '2024-02-01' },
  { id: '3', name: 'API Integration', owner: 'Emma Wilson', progress: 92, status: 'on-track', estimatedDate: '2024-02-28', priority: 'high', tasksCompleted: 184, tasksTotal: 200, startDate: '2023-12-15' },
  { id: '4', name: 'Dashboard Analytics', owner: 'David Martinez', progress: 34, status: 'blocked', estimatedDate: '2024-05-10', priority: 'low', tasksCompleted: 68, tasksTotal: 200, startDate: '2024-02-20' },
  { id: '5', name: 'Security Audit', owner: 'Lisa Anderson', progress: 67, status: 'on-track', estimatedDate: '2024-03-30', priority: 'high', tasksCompleted: 134, tasksTotal: 200, startDate: '2024-01-05' },
  { id: '6', name: 'Content Migration', owner: 'James Brown', progress: 23, status: 'delayed', estimatedDate: '2024-06-15', priority: 'medium', tasksCompleted: 46, tasksTotal: 200, startDate: '2024-03-01' },
  // Historical projects from previous periods
  { id: '7', name: 'Legacy System Modernization', owner: 'Sarah Chen', progress: 100, status: 'on-track', estimatedDate: '2023-11-30', priority: 'high', tasksCompleted: 250, tasksTotal: 250, startDate: '2023-06-01' },
  { id: '8', name: 'Cloud Infrastructure Migration', owner: 'Emma Wilson', progress: 100, status: 'on-track', estimatedDate: '2023-10-15', priority: 'high', tasksCompleted: 180, tasksTotal: 180, startDate: '2023-05-10' },
  { id: '9', name: 'Payment Gateway Integration', owner: 'Marcus Johnson', progress: 100, status: 'on-track', estimatedDate: '2023-09-20', priority: 'medium', tasksCompleted: 120, tasksTotal: 120, startDate: '2023-04-15' },
  { id: '10', name: 'User Authentication System', owner: 'David Martinez', progress: 100, status: 'on-track', estimatedDate: '2023-08-10', priority: 'high', tasksCompleted: 95, tasksTotal: 95, startDate: '2023-03-01' },
  { id: '11', name: 'Database Optimization', owner: 'Lisa Anderson', progress: 100, status: 'on-track', estimatedDate: '2023-12-05', priority: 'medium', tasksCompleted: 140, tasksTotal: 140, startDate: '2023-07-20' },
  { id: '12', name: 'Frontend Component Library', owner: 'James Brown', progress: 100, status: 'on-track', estimatedDate: '2023-11-15', priority: 'low', tasksCompleted: 200, tasksTotal: 200, startDate: '2023-05-25' },
  { id: '13', name: 'CI/CD Pipeline Setup', owner: 'Sarah Chen', progress: 100, status: 'on-track', estimatedDate: '2023-07-30', priority: 'high', tasksCompleted: 75, tasksTotal: 75, startDate: '2023-02-10' },
  { id: '14', name: 'Performance Monitoring', owner: 'Emma Wilson', progress: 100, status: 'on-track', estimatedDate: '2023-09-05', priority: 'medium', tasksCompleted: 110, tasksTotal: 110, startDate: '2023-04-01' },
  { id: '15', name: 'Documentation Portal', owner: 'Marcus Johnson', progress: 100, status: 'on-track', estimatedDate: '2023-10-25', priority: 'low', tasksCompleted: 85, tasksTotal: 85, startDate: '2023-05-15' },
];

// Helper to generate next ID
function getNextProjectId(): string {
  const maxId = Math.max(...projects.map(p => parseInt(p.id) || 0), 0);
  return String(maxId + 1);
}

// Mutable team members array for CRUD operations
let teamMembers = [
  { id: '1', name: 'Sarah Chen', velocity: 28, onTimeRate: 0.94, weeklyProductivity: 32, activeProjects: 2 },
  { id: '2', name: 'Marcus Johnson', velocity: 22, onTimeRate: 0.78, weeklyProductivity: 25, activeProjects: 1 },
  { id: '3', name: 'Emma Wilson', velocity: 31, onTimeRate: 0.91, weeklyProductivity: 35, activeProjects: 3 },
  { id: '4', name: 'David Martinez', velocity: 19, onTimeRate: 0.65, weeklyProductivity: 21, activeProjects: 1 },
  { id: '5', name: 'Lisa Anderson', velocity: 26, onTimeRate: 0.88, weeklyProductivity: 29, activeProjects: 2 },
  { id: '6', name: 'James Brown', velocity: 24, onTimeRate: 0.82, weeklyProductivity: 27, activeProjects: 1 },
];

// Helper to generate next team member ID
function getNextTeamMemberId(): string {
  const maxId = Math.max(...teamMembers.map(m => parseInt(m.id) || 0), 0);
  return String(maxId + 1);
}

// Expanded alerts with more historical data
const alerts = [
  // Recent alerts
  { id: '1', type: 'warning', message: 'alerts.messages.projectsAtRisk', messageParams: { count: 2 }, timestamp: new Date().toISOString() },
  { id: '2', type: 'error', message: 'alerts.messages.lowVelocity', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', type: 'info', message: 'alerts.messages.newProject', messageParams: { projectName: 'Content Migration' }, timestamp: new Date(Date.now() - 7200000).toISOString() },
  // Historical alerts from past days/weeks
  { id: '4', type: 'info', message: 'alerts.messages.newProject', messageParams: { projectName: 'Dashboard Analytics' }, timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '5', type: 'warning', message: 'alerts.messages.projectsAtRisk', messageParams: { count: 1 }, timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: '6', type: 'info', message: 'alerts.messages.newProject', messageParams: { projectName: 'Security Audit' }, timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: '7', type: 'error', message: 'alerts.messages.lowVelocity', timestamp: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: '8', type: 'warning', message: 'alerts.messages.projectsAtRisk', messageParams: { count: 3 }, timestamp: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: '9', type: 'info', message: 'alerts.messages.newProject', messageParams: { projectName: 'Mobile App Redesign' }, timestamp: new Date(Date.now() - 86400000 * 12).toISOString() },
  { id: '10', type: 'warning', message: 'alerts.messages.projectsAtRisk', messageParams: { count: 1 }, timestamp: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: '11', type: 'info', message: 'alerts.messages.newProject', messageParams: { projectName: 'API Integration' }, timestamp: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: '12', type: 'error', message: 'alerts.messages.lowVelocity', timestamp: new Date(Date.now() - 86400000 * 25).toISOString() },
];

export const handlers = [
  http.get('/api/kpis', ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'current';
    
    // Current period KPIs
    if (period === 'current') {
      return HttpResponse.json({
        throughput: 127,
        cycleTimeDays: 4.3,
        onTimeRate: 0.86,
        activeProjects: 6,
        totalTasks: 610,
        completedTasks: 478,
      });
    }
    
    // Previous period KPIs (slightly lower values to show trends)
    return HttpResponse.json({
      throughput: 112,
      cycleTimeDays: 5.1,
      onTimeRate: 0.78,
      activeProjects: 5,
      totalTasks: 580,
      completedTasks: 425,
    });
  }),
  http.get('/api/series', ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'current';
    return HttpResponse.json(period === 'previous' ? previousSeries : demoSeries);
  }),
  // Projects CRUD
  http.get('/api/projects', () => HttpResponse.json(projects)),
  http.post('/api/projects', async ({ request }) => {
    const body = await request.json() as any;
    const newProject = {
      id: getNextProjectId(),
      name: body.name,
      owner: body.owner,
      progress: body.progress ?? 0,
      status: body.status ?? 'on-track',
      estimatedDate: body.estimatedDate,
      priority: body.priority ?? 'medium',
      tasksCompleted: body.tasksCompleted ?? 0,
      tasksTotal: body.tasksTotal ?? 0,
      startDate: body.startDate ?? new Date().toISOString().split('T')[0],
    };
    projects.push(newProject);
    return HttpResponse.json(newProject, { status: 201 });
  }),
  http.put('/api/projects/:id', async ({ request, params }) => {
    const { id } = params;
    const body = await request.json() as any;
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    projects[index] = { ...projects[index], ...body, id: String(id) };
    return HttpResponse.json(projects[index]);
  }),
  http.delete('/api/projects/:id', ({ params }) => {
    const { id } = params;
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    projects.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),
  // Team members CRUD
  http.get('/api/team', () => HttpResponse.json(teamMembers)),
  http.post('/api/team', async ({ request }) => {
    const body = await request.json() as any;
    const newMember = {
      id: getNextTeamMemberId(),
      name: body.name,
      velocity: body.velocity ?? 0,
      onTimeRate: body.onTimeRate ?? 0,
      weeklyProductivity: body.weeklyProductivity ?? 0,
      activeProjects: body.activeProjects ?? 0,
    };
    teamMembers.push(newMember);
    return HttpResponse.json(newMember, { status: 201 });
  }),
  http.put('/api/team/:id', async ({ request, params }) => {
    const { id } = params;
    const body = await request.json() as any;
    const index = teamMembers.findIndex(m => m.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ error: 'Team member not found' }, { status: 404 });
    }
    
    teamMembers[index] = { ...teamMembers[index], ...body, id: String(id) };
    return HttpResponse.json(teamMembers[index]);
  }),
  http.delete('/api/team/:id', ({ params }) => {
    const { id } = params;
    const index = teamMembers.findIndex(m => m.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ error: 'Team member not found' }, { status: 404 });
    }
    
    teamMembers.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),
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
