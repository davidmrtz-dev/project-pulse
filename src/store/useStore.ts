import { create } from 'zustand';
import type {
  KPI,
  Point,
  Project,
  TeamMember,
  Alert,
  WeeklyTrend,
  BacklogData,
  TaskStatus,
  ProjectStatus,
  TeamWorkload,
} from '../types';

type FilterState = {
  dateRange: string;
  team: string;
  status: string;
  priority: string;
};

interface AppState {
  // Data
  kpi: KPI | null;
  series: Point[];
  previousSeries: Point[];
  projects: Project[];
  teamMembers: TeamMember[];
  alerts: Alert[];
  weeklyTrends: WeeklyTrend[];
  previousWeeklyTrends: WeeklyTrend[];
  backlogGrowth: BacklogData[];
  previousBacklogGrowth: BacklogData[];
  taskStatus: TaskStatus[];
  projectStatus: ProjectStatus[];
  teamWorkload: TeamWorkload[];
  
  // UI State
  activeTab: 'overview' | 'projects' | 'team' | 'alerts';
  filters: FilterState;
  comparePeriod: boolean; // Enable/disable period comparison
  
  // Loading states
  loading: {
    kpi: boolean;
    series: boolean;
    projects: boolean;
    team: boolean;
    alerts: boolean;
    weeklyTrends: boolean;
    backlogGrowth: boolean;
    taskStatus: boolean;
    projectStatus: boolean;
    teamWorkload: boolean;
  };
  
  // Error states
  errors: {
    kpi: string | null;
    series: string | null;
    projects: string | null;
    team: string | null;
    alerts: string | null;
    weeklyTrends: string | null;
    backlogGrowth: string | null;
    taskStatus: string | null;
    projectStatus: string | null;
    teamWorkload: string | null;
  };
  
  // Actions
  setKpi: (kpi: KPI | null) => void;
  setSeries: (series: Point[]) => void;
  setProjects: (projects: Project[]) => void;
  setTeamMembers: (teamMembers: TeamMember[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  setWeeklyTrends: (trends: WeeklyTrend[]) => void;
  setBacklogGrowth: (data: BacklogData[]) => void;
  setTaskStatus: (data: TaskStatus[]) => void;
  setProjectStatus: (data: ProjectStatus[]) => void;
  setTeamWorkload: (data: TeamWorkload[]) => void;
  setActiveTab: (tab: 'overview' | 'projects' | 'team' | 'alerts') => void;
  setFilters: (filters: FilterState) => void;
  setComparePeriod: (comparePeriod: boolean) => void;
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;
  setError: (key: keyof AppState['errors'], error: string | null) => void;
  
  // Fetch actions
  fetchKpi: () => Promise<void>;
  fetchSeries: (period?: 'current' | 'previous') => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchTeam: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchWeeklyTrends: (period?: 'current' | 'previous') => Promise<void>;
  fetchBacklogGrowth: (period?: 'current' | 'previous') => Promise<void>;
  fetchTaskStatus: () => Promise<void>;
  fetchProjectStatus: () => Promise<void>;
  fetchTeamWorkload: () => Promise<void>;
  fetchAll: () => Promise<void>;
  
  // CRUD actions for projects
  createProject: (project: Omit<Project, 'id'>) => Promise<Project>;
  updateProject: (id: string, project: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  
  // CRUD actions for team members
  createTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<TeamMember>;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => Promise<TeamMember>;
  deleteTeamMember: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  kpi: null,
  series: [],
  previousSeries: [],
  projects: [],
  teamMembers: [],
  alerts: [],
  weeklyTrends: [],
  previousWeeklyTrends: [],
  backlogGrowth: [],
  previousBacklogGrowth: [],
  taskStatus: [],
  projectStatus: [],
  teamWorkload: [],
  activeTab: 'overview',
  filters: {
    dateRange: 'all',
    team: 'all',
    status: 'all',
    priority: 'all',
  },
  comparePeriod: false,
  loading: {
    kpi: false,
    series: false,
    projects: false,
    team: false,
    alerts: false,
    weeklyTrends: false,
    backlogGrowth: false,
    taskStatus: false,
    projectStatus: false,
    teamWorkload: false,
  },
  errors: {
    kpi: null,
    series: null,
    projects: null,
    team: null,
    alerts: null,
    weeklyTrends: null,
    backlogGrowth: null,
    taskStatus: null,
    projectStatus: null,
    teamWorkload: null,
  },
  
  // Setters
  setKpi: (kpi) => set({ kpi }),
  setSeries: (series) => set({ series }),
  setPreviousSeries: (previousSeries: Point[]) => set({ previousSeries }),
  setProjects: (projects) => set({ projects }),
  setTeamMembers: (teamMembers) => set({ teamMembers }),
  setAlerts: (alerts) => set({ alerts }),
  setWeeklyTrends: (weeklyTrends: WeeklyTrend[]) => set({ weeklyTrends }),
  setPreviousWeeklyTrends: (previousWeeklyTrends: WeeklyTrend[]) => set({ previousWeeklyTrends }),
  setBacklogGrowth: (backlogGrowth: BacklogData[]) => set({ backlogGrowth }),
  setPreviousBacklogGrowth: (previousBacklogGrowth: BacklogData[]) => set({ previousBacklogGrowth }),
  setTaskStatus: (taskStatus: TaskStatus[]) => set({ taskStatus }),
  setProjectStatus: (projectStatus: ProjectStatus[]) => set({ projectStatus }),
  setTeamWorkload: (teamWorkload: TeamWorkload[]) => set({ teamWorkload }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setFilters: (filters: FilterState) => set({ filters }),
  setComparePeriod: (comparePeriod: boolean) => set({ comparePeriod }),
  setLoading: (key, value) =>
    set((state) => ({
      loading: { ...state.loading, [key]: value },
    })),
  setError: (key, error) =>
    set((state) => ({
      errors: { ...state.errors, [key]: error },
    })),
  
  // Fetch actions
  fetchKpi: async () => {
    set((state) => ({
      loading: { ...state.loading, kpi: true },
      errors: { ...state.errors, kpi: null },
    }));
    try {
      const response = await fetch('/api/kpis');
      if (!response.ok) throw new Error('Failed to fetch KPIs');
      const data = await response.json();
      set({ kpi: data });
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, kpi: error instanceof Error ? error.message : 'Unknown error' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, kpi: false },
      }));
    }
  },
  
  fetchSeries: async (period: 'current' | 'previous' = 'current') => {
    set((state) => ({
      loading: { ...state.loading, series: true },
      errors: { ...state.errors, series: null },
    }));
    try {
      const response = await fetch(`/api/series?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch series');
      const data = await response.json();
      if (period === 'previous') {
        set({ previousSeries: data });
      } else {
        set({ series: data });
      }
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, series: error instanceof Error ? error.message : 'Unknown error' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, series: false },
      }));
    }
  },
  
  fetchProjects: async () => {
    set((state) => ({
      loading: { ...state.loading, projects: true },
      errors: { ...state.errors, projects: null },
    }));
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      set({ projects: data });
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, projects: error instanceof Error ? error.message : 'Unknown error' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, projects: false },
      }));
    }
  },
  
  fetchTeam: async () => {
    set((state) => ({
      loading: { ...state.loading, team: true },
      errors: { ...state.errors, team: null },
    }));
    try {
      const response = await fetch('/api/team');
      if (!response.ok) throw new Error('Failed to fetch team');
      const data = await response.json();
      set({ teamMembers: data });
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, team: error instanceof Error ? error.message : 'Unknown error' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, team: false },
      }));
    }
  },
  
  fetchAlerts: async () => {
    set((state) => ({
      loading: { ...state.loading, alerts: true },
      errors: { ...state.errors, alerts: null },
    }));
    try {
      const response = await fetch('/api/alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      set({ alerts: data });
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, alerts: error instanceof Error ? error.message : 'Unknown error' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, alerts: false },
      }));
    }
  },
  
  fetchWeeklyTrends: async (period: 'current' | 'previous' = 'current') => {
    set((state) => ({
      loading: { ...state.loading, weeklyTrends: true },
      errors: { ...state.errors, weeklyTrends: null },
    }));
    try {
      const response = await fetch(`/api/weekly-trends?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch weekly trends');
      const data = await response.json();
      if (period === 'previous') {
        set({ previousWeeklyTrends: data });
      } else {
        set({ weeklyTrends: data });
      }
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, weeklyTrends: error instanceof Error ? error.message : 'Unknown error' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, weeklyTrends: false },
      }));
    }
  },
  
  fetchBacklogGrowth: async (period: 'current' | 'previous' = 'current') => {
    set((state) => ({
      loading: { ...state.loading, backlogGrowth: true },
      errors: { ...state.errors, backlogGrowth: null },
    }));
    try {
      const response = await fetch(`/api/backlog-growth?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch backlog growth');
      const data = await response.json();
      if (period === 'previous') {
        set({ previousBacklogGrowth: data });
      } else {
        set({ backlogGrowth: data });
      }
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, backlogGrowth: error instanceof Error ? error.message : 'Unknown error' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, backlogGrowth: false },
      }));
    }
  },
  
  fetchTaskStatus: async () => {
    set((state) => ({
      loading: { ...state.loading, taskStatus: true },
      errors: { ...state.errors, taskStatus: null },
    }));
    try {
      const response = await fetch('/api/task-status');
      if (!response.ok) throw new Error('Failed to fetch task status');
      const data = await response.json();
      set({ taskStatus: data });
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, taskStatus: error instanceof Error ? error.message : 'Unknown error' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, taskStatus: false },
      }));
    }
  },
  
  fetchProjectStatus: async () => {
    set((state) => ({
      loading: { ...state.loading, projectStatus: true },
      errors: { ...state.errors, projectStatus: null },
    }));
    try {
      const response = await fetch('/api/project-status');
      if (!response.ok) throw new Error('Failed to fetch project status');
      const data = await response.json();
      set({ projectStatus: data });
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, projectStatus: error instanceof Error ? error.message : 'Unknown error' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, projectStatus: false },
      }));
    }
  },
  
  fetchTeamWorkload: async () => {
    set((state) => ({
      loading: { ...state.loading, teamWorkload: true },
      errors: { ...state.errors, teamWorkload: null },
    }));
    try {
      const response = await fetch('/api/team-workload');
      if (!response.ok) throw new Error('Failed to fetch team workload');
      const data = await response.json();
      set({ teamWorkload: data });
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, teamWorkload: error instanceof Error ? error.message : 'Unknown error' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, teamWorkload: false },
      }));
    }
  },
  
  fetchAll: async () => {
    const {
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
    } = get();
    await Promise.all([
      fetchKpi(),
      fetchSeries(),
      fetchProjects(),
      fetchTeam(),
      fetchAlerts(),
      fetchWeeklyTrends(),
      fetchBacklogGrowth(),
      fetchTaskStatus(),
      fetchProjectStatus(),
      fetchTeamWorkload(),
    ]);
  },
  
  // CRUD actions for projects
  createProject: async (projectData) => {
    set((state) => ({
      loading: { ...state.loading, projects: true },
      errors: { ...state.errors, projects: null },
    }));
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error('Failed to create project');
      const newProject = await response.json();
      set((state) => ({
        projects: [...state.projects, newProject],
      }));
      // Refresh projects list
      await get().fetchProjects();
      return newProject;
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, projects: error instanceof Error ? error.message : 'Unknown error' },
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, projects: false },
      }));
    }
  },
  
  updateProject: async (id, projectData) => {
    set((state) => ({
      loading: { ...state.loading, projects: true },
      errors: { ...state.errors, projects: null },
    }));
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error('Failed to update project');
      const updatedProject = await response.json();
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
      }));
      // Refresh projects list
      await get().fetchProjects();
      return updatedProject;
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, projects: error instanceof Error ? error.message : 'Unknown error' },
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, projects: false },
      }));
    }
  },
  
  deleteProject: async (id) => {
    set((state) => ({
      loading: { ...state.loading, projects: true },
      errors: { ...state.errors, projects: null },
    }));
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
      // Refresh projects list
      await get().fetchProjects();
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, projects: error instanceof Error ? error.message : 'Unknown error' },
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, projects: false },
      }));
    }
  },
  
  // CRUD actions for team members
  createTeamMember: async (memberData) => {
    set((state) => ({
      loading: { ...state.loading, team: true },
      errors: { ...state.errors, team: null },
    }));
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      if (!response.ok) throw new Error('Failed to create team member');
      const newMember = await response.json();
      set((state) => ({
        teamMembers: [...state.teamMembers, newMember],
      }));
      // Refresh team list
      await get().fetchTeam();
      return newMember;
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, team: error instanceof Error ? error.message : 'Unknown error' },
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, team: false },
      }));
    }
  },
  
  updateTeamMember: async (id, memberData) => {
    set((state) => ({
      loading: { ...state.loading, team: true },
      errors: { ...state.errors, team: null },
    }));
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      if (!response.ok) throw new Error('Failed to update team member');
      const updatedMember = await response.json();
      set((state) => ({
        teamMembers: state.teamMembers.map((m) => (m.id === id ? updatedMember : m)),
      }));
      // Refresh team list
      await get().fetchTeam();
      return updatedMember;
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, team: error instanceof Error ? error.message : 'Unknown error' },
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, team: false },
      }));
    }
  },
  
  deleteTeamMember: async (id) => {
    set((state) => ({
      loading: { ...state.loading, team: true },
      errors: { ...state.errors, team: null },
    }));
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete team member');
      set((state) => ({
        teamMembers: state.teamMembers.filter((m) => m.id !== id),
      }));
      // Refresh team list
      await get().fetchTeam();
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, team: error instanceof Error ? error.message : 'Unknown error' },
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, team: false },
      }));
    }
  },
}));

