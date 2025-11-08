import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  exportProjectsToCSV,
  exportTeamMembersToCSV,
  exportAlertsToCSV,
  exportAllDataToCSV,
} from '../csvExport';
import type { Project, TeamMember, Alert, KPI } from '../../types';

// Mock the download function
let mockLink: any;

beforeEach(() => {
  mockLink = {
    setAttribute: vi.fn(),
    click: vi.fn(),
    style: {},
  };
  
  global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = vi.fn();
  global.document.createElement = vi.fn(() => mockLink);
  global.document.body.appendChild = vi.fn();
  global.document.body.removeChild = vi.fn();
});

describe('CSV Export Functions', () => {
  describe('exportProjectsToCSV', () => {
    it('should export projects to CSV format', () => {
      const projects: Project[] = [
        {
          id: '1',
          name: 'Test Project',
          owner: 'John Doe',
          progress: 75,
          status: 'on-track',
          estimatedDate: '2024-12-31',
          priority: 'high',
          tasksCompleted: 150,
          tasksTotal: 200,
          startDate: '2024-01-01',
        },
      ];

      exportProjectsToCSV(projects);

      expect(global.document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'blob:mock-url');
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        expect.stringContaining('projects_')
      );
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle empty projects array', () => {
      exportProjectsToCSV([]);
      expect(global.document.createElement).toHaveBeenCalled();
    });
  });

  describe('exportTeamMembersToCSV', () => {
    it('should export team members to CSV format', () => {
      const teamMembers: TeamMember[] = [
        {
          id: '1',
          name: 'Jane Smith',
          velocity: 25,
          onTimeRate: 0.9,
          weeklyProductivity: 30,
          activeProjects: 2,
        },
      ];

      exportTeamMembersToCSV(teamMembers);

      expect(global.document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        expect.stringContaining('team_members_')
      );
    });
  });

  describe('exportAlertsToCSV', () => {
    it('should export alerts to CSV format', () => {
      const alerts: Alert[] = [
        {
          id: '1',
          type: 'warning',
          message: 'Test alert',
          timestamp: '2024-01-01T00:00:00Z',
        },
      ];

      exportAlertsToCSV(alerts);

      expect(global.document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        expect.stringContaining('alerts_')
      );
    });
  });

  describe('exportAllDataToCSV', () => {
    it('should export all data to CSV format', () => {
      const data = {
        projects: [
          {
            id: '1',
            name: 'Test Project',
            owner: 'John Doe',
            progress: 75,
            status: 'on-track' as const,
            estimatedDate: '2024-12-31',
            priority: 'high' as const,
          },
        ],
        teamMembers: [
          {
            id: '1',
            name: 'Jane Smith',
            velocity: 25,
            onTimeRate: 0.9,
            weeklyProductivity: 30,
          },
        ],
        alerts: [
          {
            id: '1',
            type: 'warning' as const,
            message: 'Test alert',
            timestamp: '2024-01-01T00:00:00Z',
          },
        ],
        kpi: {
          throughput: 127,
          cycleTimeDays: 4.3,
          onTimeRate: 0.86,
          activeProjects: 6,
          totalTasks: 610,
          completedTasks: 478,
        } as KPI,
      };

      exportAllDataToCSV(data);

      expect(global.document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        expect.stringContaining('project_pulse_export_')
      );
    });

    it('should handle partial data', () => {
      const data = {
        projects: [],
        kpi: {
          throughput: 127,
          cycleTimeDays: 4.3,
          onTimeRate: 0.86,
        } as KPI,
      };

      exportAllDataToCSV(data);
      expect(global.document.createElement).toHaveBeenCalled();
    });
  });
});

