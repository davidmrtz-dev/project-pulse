export type KPI = {
  throughput: number;
  cycleTimeDays: number;
  onTimeRate: number;
  activeProjects?: number;
  totalTasks?: number;
  completedTasks?: number;
};

export type Point = {
  month: number;
  velocity: number;
  completion: number;
};

export type WeeklyTrend = {
  week: number;
  completed: number;
  inProgress: number;
  blocked: number;
};

export type BacklogData = {
  month: number;
  backlog: number;
  completed: number;
};

export type TaskStatus = {
  status: string;
  count: number;
  color: string;
};

export type ProjectStatus = {
  status: string;
  count: number;
  percentage: number;
};

export type TeamWorkload = {
  name: string;
  activeTasks: number;
  completedThisWeek: number;
};

export type Project = {
  id: string;
  name: string;
  owner: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'blocked';
  estimatedDate: string;
  priority: 'high' | 'medium' | 'low';
  tasksCompleted?: number;
  tasksTotal?: number;
  startDate?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  velocity: number;
  onTimeRate: number;
  weeklyProductivity: number;
  activeProjects?: number;
};

export type Alert = {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
};

