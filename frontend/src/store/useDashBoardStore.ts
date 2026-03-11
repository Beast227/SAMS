import { create } from "zustand";

interface DashboardState {
  activeAlerts: number;
  searchQuery: string;

  updateStats: (alerts: number) => void;
  setSearchQuery: (query: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeAlerts:0,

  searchQuery: "",

  updateStats: (alerts) => set({ activeAlerts: alerts }),

  setSearchQuery: (query) => set({ searchQuery: query }),
}));
