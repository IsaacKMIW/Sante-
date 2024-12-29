import { create } from 'zustand';
import { PatientBase, PatientSearchFilters } from '../../types/patient';
import { searchPatients, createPatient, logPatientAccess } from '../services/patient';
import { useAuthStore } from './authStore';

interface PatientState {
  patients: PatientBase[];
  loading: boolean;
  error: string | null;
  currentFilters: PatientSearchFilters | null;
  searchResults: PatientBase[];
  fetchPatients: (filters: PatientSearchFilters) => Promise<void>;
  addPatient: (patientData: Omit<PatientBase, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  clearSearch: () => void;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  loading: false,
  error: null,
  currentFilters: null,
  searchResults: [],

  fetchPatients: async (filters: PatientSearchFilters) => {
    set({ loading: true, error: null });
    try {
      const results = await searchPatients(filters);
      set({
        searchResults: results,
        currentFilters: filters,
        loading: false
      });

      // Log the search access
      const { user } = useAuthStore.getState();
      if (user) {
        await logPatientAccess(
          'search',
          user.id,
          user.role,
          user.hospitalId || '',
          'view',
          `Search performed with filters: ${JSON.stringify(filters)}`
        );
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la recherche',
        loading: false
      });
    }
  },

  addPatient: async (patientData) => {
    set({ loading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user?.hospitalId) {
        throw new Error('Utilisateur non autorisé');
      }
      
      // Validation du rôle
      const authorizedRoles = ['receptionist', 'nurse', 'doctor', 'admin_hospital'];
      if (!authorizedRoles.includes(user.role)) {
        throw new Error('Rôle non autorisé pour cette action');
      }

      const newPatient = await createPatient({
        ...patientData,
        originHospitalId: user.hospitalId
      });

      set(state => ({
        patients: [newPatient, ...state.patients],
        searchResults: [newPatient, ...state.searchResults],
        loading: false
      }));

      // Log the creation
      await logPatientAccess(
        newPatient.id,
        user.id,
        user.role,
        user.hospitalId,
        'create'
      );
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la création',
        loading: false
      });
    }
  },

  clearSearch: () => {
    set({
      searchResults: [],
      currentFilters: null
    });
  }
}));