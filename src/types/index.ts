export type KPI = {
  throughput: number;
  cycleTimeDays: number;
  onTimeRate: number;
};

export type Point = {
  month: number;
  velocity: number;
  completion: number;
};

export type Project = {
  id: string;
  name: string;
  owner: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'blocked';
  estimatedDate: string;
  priority: 'high' | 'medium' | 'low';
};

export type TeamMember = {
  id: string;
  name: string;
  velocity: number;
  onTimeRate: number;
  weeklyProductivity: number;
};

export type Alert = {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
};

