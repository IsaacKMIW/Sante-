import { create } from 'zustand';
import { Patient, Appointment, Message } from '../../types/receptionist';
import { subscribeToAppointments, subscribeToPatientQueue, subscribeToMessages } from '../services/receptionist';

interface ReceptionistState {
  todayStats: {
    totalPatients: number;
    upcomingAppointments: number;
    unreadNotifications: number;
  };
  patients: Patient[];
  todayAppointments: Appointment[];
  queuedPatients: Patient[];
  messages: Message[];
  loading: boolean;
  error: string | null;
  unsubscribeFromAppointments: (() => void) | null;
  unsubscribeFromQueue: (() => void) | null;
  unsubscribeFromMessages: (() => void) | null;
  initialize: () => void;
  cleanup: () => void;
}

export const useReceptionistStore = create<ReceptionistState>((set, get) => ({
  todayStats: {
    totalPatients: 0,
    upcomingAppointments: 0,
    unreadNotifications: 0,
  },
  patients: [], // Liste des patients initialisée comme tableau vide
  todayAppointments: [],
  queuedPatients: [],
  messages: [],
  loading: true,
  error: null,
  unsubscribeFromAppointments: null,
  unsubscribeFromQueue: null,
  unsubscribeFromMessages: null,

  initialize: () => {
    set({ loading: true, error: null });

    try {
      // S'abonner aux rendez-vous
      const unsubscribeFromAppointments = subscribeToAppointments((appointments) => {
        set({ 
          todayAppointments: appointments,
          todayStats: {
            ...get().todayStats,
            upcomingAppointments: appointments.length
          }
        });
      });

      // S'abonner à la file d'attente
      const unsubscribeFromQueue = subscribeToPatientQueue((patients) => {
        set({ 
          queuedPatients: patients,
          patients, // Mettre à jour la liste complète des patients
          todayStats: {
            ...get().todayStats,
            totalPatients: patients.length
          }
        });
      });

      // S'abonner aux messages
      const unsubscribeFromMessages = subscribeToMessages((messages) => {
        set({ 
          messages,
          todayStats: {
            ...get().todayStats,
            unreadNotifications: messages.filter(m => !m.read).length
          }
        });
      });

      set({
        unsubscribeFromAppointments,
        unsubscribeFromQueue,
        unsubscribeFromMessages,
        loading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur d\'initialisation',
        loading: false 
      });
    }
  },

  cleanup: () => {
    const { 
      unsubscribeFromAppointments, 
      unsubscribeFromQueue, 
      unsubscribeFromMessages 
    } = get();

    if (unsubscribeFromAppointments) unsubscribeFromAppointments();
    if (unsubscribeFromQueue) unsubscribeFromQueue();
    if (unsubscribeFromMessages) unsubscribeFromMessages();

    set({
      unsubscribeFromAppointments: null,
      unsubscribeFromQueue: null,
      unsubscribeFromMessages: null,
      patients: [], // Réinitialiser la liste des patients
      todayAppointments: [],
      queuedPatients: [],
      messages: [],
      todayStats: {
        totalPatients: 0,
        upcomingAppointments: 0,
        unreadNotifications: 0,
      }
    });
  }
}));