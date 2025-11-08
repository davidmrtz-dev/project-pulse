import { create } from 'zustand';
import type { KPI, Point, Project, TeamMember, Alert } from '../types';

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
  projects: Project[];
  teamMembers: TeamMember[];
  alerts: Alert[];
  
  // UI State
  activeTab: 'overview' | 'projects' | 'team' | 'alerts';
  filters: FilterState;
  
  // Loading states
  loading: {
    kpi: boolean;
    series: boolean;
    projects: boolean;
    team: boolean;
    alerts: boolean;
  };
  
  // Error states
  errors: {
    kpi: string | null;
    series: string | null;
    projects: string | null;
    team: string | null;
    alerts: string | null;
  };
  
  // Actions
  setKpi: (kpi: KPI | null) => void;
  setSeries: (series: Point[]) => void;
  setProjects: (projects: Project[]) => void;
  setTeamMembers: (teamMembers: TeamMember[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  setActiveTab: (tab: 'overview' | 'projects' | 'team' | 'alerts') => void;
  setFilters: (filters: FilterState) => void;
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;
  setError: (key: keyof AppState['errors'], error: string | null) => void;
  
  // Fetch actions
  fetchKpi: () => Promise<void>;
  fetchSeries: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchTeam: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchAll: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  kpi: null,
  series: [],
  projects: [],
  teamMembers: [],
  alerts: [],
  activeTab: 'overview',
  filters: {
    dateRange: 'all',
    team: 'all',
    status: 'all',
    priority: 'all',
  },
  loading: {
    kpi: false,
    series: false,
    projects: false,
    team: false,
    alerts: false,
  },
  errors: {
    kpi: null,
    series: null,
    projects: null,
    team: null,
    alerts: null,
  },
  
  // Setters
  setKpi: (kpi) => set({ kpi }),
  setSeries: (series) => set({ series }),
  setProjects: (projects) => set({ projects }),
  setTeamMembers: (teamMembers) => set({ teamMembers }),
  setAlerts: (alerts) => set({ alerts }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setFilters: (filters) => set({ filters }),
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
  
  fetchSeries: async () => {
    set((state) => ({
      loading: { ...state.loading, series: true },
      errors: { ...state.errors, series: null },
    }));
    try {
      const response = await fetch('/api/series');
      if (!response.ok) throw new Error('Failed to fetch series');
      const data = await response.json();
      set({ series: data });
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
  
  fetchAll: async () => {
    const { fetchKpi, fetchSeries, fetchProjects, fetchTeam, fetchAlerts } = get();
    await Promise.all([
      fetchKpi(),
      fetchSeries(),
      fetchProjects(),
      fetchTeam(),
      fetchAlerts(),
    ]);
  },
}));

