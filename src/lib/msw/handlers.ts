import { http, HttpResponse } from 'msw';

const demoSeries = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  velocity: Math.round(60 + Math.random() * 25),
  completion: Math.round(50 + Math.random() * 40),
}));

const projects = [
  { id: '1', name: 'E-commerce Platform', owner: 'Sarah Chen', progress: 78, status: 'on-track', estimatedDate: '2024-03-15', priority: 'high' },
  { id: '2', name: 'Mobile App Redesign', owner: 'Marcus Johnson', progress: 45, status: 'delayed', estimatedDate: '2024-04-20', priority: 'medium' },
  { id: '3', name: 'API Integration', owner: 'Emma Wilson', progress: 92, status: 'on-track', estimatedDate: '2024-02-28', priority: 'high' },
  { id: '4', name: 'Dashboard Analytics', owner: 'David Martinez', progress: 34, status: 'blocked', estimatedDate: '2024-05-10', priority: 'low' },
  { id: '5', name: 'Security Audit', owner: 'Lisa Anderson', progress: 67, status: 'on-track', estimatedDate: '2024-03-30', priority: 'high' },
  { id: '6', name: 'Content Migration', owner: 'James Brown', progress: 23, status: 'delayed', estimatedDate: '2024-06-15', priority: 'medium' },
];

const teamMembers = [
  { id: '1', name: 'Sarah Chen', velocity: 28, onTimeRate: 0.94, weeklyProductivity: 32 },
  { id: '2', name: 'Marcus Johnson', velocity: 22, onTimeRate: 0.78, weeklyProductivity: 25 },
  { id: '3', name: 'Emma Wilson', velocity: 31, onTimeRate: 0.91, weeklyProductivity: 35 },
  { id: '4', name: 'David Martinez', velocity: 19, onTimeRate: 0.65, weeklyProductivity: 21 },
  { id: '5', name: 'Lisa Anderson', velocity: 26, onTimeRate: 0.88, weeklyProductivity: 29 },
  { id: '6', name: 'James Brown', velocity: 24, onTimeRate: 0.82, weeklyProductivity: 27 },
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
  })),
  http.get('/api/series', () => HttpResponse.json(demoSeries)),
  http.get('/api/projects', () => HttpResponse.json(projects)),
  http.get('/api/team', () => HttpResponse.json(teamMembers)),
  http.get('/api/alerts', () => HttpResponse.json(alerts)),
];
