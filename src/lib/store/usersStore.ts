import { create } from 'zustand';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { User } from '../../types';
import { fetchAllUsers, validateUserData, createUser, deleteUserCompletely } from '../services/users';
import { useAuthStore } from './authStore';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  unsubscribeFromUsers: (() => void) | null;
  fetchUsers: () => Promise<void>;
  setUsers: (users: User[]) => void;
  addUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  cleanup: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  unsubscribeFromUsers: null,
  
  setUsers: (users: User[]) => {
    set({
      users
    });
  },

  cleanup: () => {
    const { unsubscribeFromUsers } = get();
    if (unsubscribeFromUsers) {
      unsubscribeFromUsers();
      set({ unsubscribeFromUsers: null });
    }
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await fetchAllUsers();
      set({ users });
      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des utilisateurs',
        loading: false
      });
    }
  },

  addUser: async (userData) => {
    try {
      await validateUserData(userData);
      const newUser = await createUser(userData as Required<User>);
      set(state => ({
        users: [newUser, ...state.users]
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'utilisateur');
    }
  },

  updateUser: async (id, userData) => {
    try {
      await validateUserData({ ...userData, id });
      await updateDoc(doc(db, 'users', id), {
        ...userData,
        updatedAt: new Date().toISOString()
      });

      set(state => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...userData } : user
        )
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'utilisateur');
    }
  },

  deleteUser: async (id) => {
    try {
      await deleteUserCompletely(id);
      set(state => ({
        users: state.users.filter(user => user.id !== id)
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'utilisateur');
    }
  },
}));