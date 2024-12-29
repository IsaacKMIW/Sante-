import { create } from 'zustand';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Hospital } from '../../types';

interface HospitalsState {
  hospitals: Hospital[];
  loading: boolean;
  error: string | null;
  fetchHospitals: () => Promise<void>;
  addHospital: (hospitalData: Omit<Hospital, 'id' | 'createdAt' | 'isActive'>) => Promise<void>;
  updateHospital: (id: string, hospitalData: Partial<Hospital>) => Promise<void>;
  deleteHospital: (id: string) => Promise<void>;
  toggleHospitalStatus: (id: string) => Promise<void>;
}

export const useHospitalsStore = create<HospitalsState>((set, get) => ({
  hospitals: [],
  loading: false,
  error: null,

  fetchHospitals: async () => {
    set({ loading: true, error: null });
    try {
      // Check if we already have hospitals loaded
      if (get().hospitals.length > 0) {
        set({ loading: false });
        return;
      }

      const snapshot = await getDocs(collection(db, 'hospitals'));
      const hospitals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Hospital[];
      
      set({ hospitals, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des hôpitaux',
        loading: false
      });
    }
  },

  addHospital: async (hospitalData) => {
    try {
      const newHospital = {
        ...hospitalData,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      const docRef = await addDoc(collection(db, 'hospitals'), newHospital);
      const hospital = { id: docRef.id, ...newHospital };
      set(state => ({
        hospitals: [...state.hospitals, hospital]
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'hôpital');
    }
  },

  updateHospital: async (id, hospitalData) => {
    try {
      await updateDoc(doc(db, 'hospitals', id), {
        ...hospitalData,
        updatedAt: new Date().toISOString()
      });
      set(state => ({
        hospitals: state.hospitals.map(h =>
          h.id === id ? { ...h, ...hospitalData } : h
        )
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'hôpital');
    }
  },

  deleteHospital: async (id) => {
    try {
      await deleteDoc(doc(db, 'hospitals', id));
      set(state => ({
        hospitals: state.hospitals.filter(h => h.id !== id)
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'hôpital');
    }
  },

  toggleHospitalStatus: async (id) => {
    const hospital = get().hospitals.find(h => h.id === id);
    if (hospital) {
      await get().updateHospital(id, { isActive: !hospital.isActive });
    }
  },
}));