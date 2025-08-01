import { create } from 'zustand';
import { User, PRD, Project } from '@/types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // PRD state
  prds: PRD[];
  currentPRD: PRD | null;
  prdLoading: boolean;
  
  // Project state
  projects: Project[];
  currentProject: Project | null;
  projectLoading: boolean;
  
  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  setUser: (user: User | null) => void;
  setPRDs: (prds: PRD[]) => void;
  setProjects: (projects: Project[]) => void;
  setCurrentPRD: (prd: PRD | null) => void;
  setCurrentProject: (project: Project | null) => void;
  setPRDLoading: (loading: boolean) => void;
  setProjectLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  prds: [],
  currentPRD: null,
  prdLoading: false,
  projects: [],
  currentProject: null,
  projectLoading: false,
  sidebarOpen: false,
  theme: 'light',
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setPRDs: (prds) => set({ prds }),
  setProjects: (projects) => set({ projects }),
  setCurrentPRD: (prd) => set({ currentPRD: prd }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setPRDLoading: (loading) => set({ prdLoading: loading }),
  setProjectLoading: (loading) => set({ projectLoading: loading }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
})); 