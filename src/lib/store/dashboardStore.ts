import { create } from 'zustand';
import { DashboardStats, Notification } from '../../types';
import { subscribeToDashboardStats, subscribeToNotifications } from '../services/dashboard';

interface DashboardState {
  stats: DashboardStats;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  unsubscribeFromStats: (() => void) | null;
  unsubscribeFromNotifications: (() => void) | null;
  initializeDashboard: () => void;
  cleanup: () => void;
}

const initialStats: DashboardStats = {
  hospitals: { total: 0, active: 0, new: 0 },
  users: { total: 0, byRole: {}, active: 0 },
  rfidCards: { total: 0, active: 0 }
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: initialStats,
  notifications: [],
  loading: true,
  error: null,
  unsubscribeFromStats: null,
  unsubscribeFromNotifications: null,

  initializeDashboard: () => {
    set({ loading: true, error: null });

    try {
      // S'abonner aux statistiques
      const unsubscribeFromStats = subscribeToDashboardStats((newStats) => {
        set(state => ({
          stats: {
            ...state.stats,
            ...newStats
          },
          loading: false
        }));
      });

      // S'abonner aux notifications
      const unsubscribeFromNotifications = subscribeToNotifications((notifications) => {
        set({ notifications });
      });

      set({
        unsubscribeFromStats,
        unsubscribeFromNotifications
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur d\'initialisation',
        loading: false 
      });
    }
  },

  cleanup: () => {
    const { unsubscribeFromStats, unsubscribeFromNotifications } = get();
    if (unsubscribeFromStats) {
      unsubscribeFromStats();
    }
    if (unsubscribeFromNotifications) {
      unsubscribeFromNotifications();
    }
    set({
      unsubscribeFromStats: null,
      unsubscribeFromNotifications: null,
      stats: initialStats,
      notifications: []
    });
  }
}));