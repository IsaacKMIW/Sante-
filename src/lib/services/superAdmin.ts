import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { User } from '../../types';
import { markSuperAdminCreated } from './config';
import { FirebaseError } from 'firebase/app';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Cet email est déjà utilisé. Veuillez en choisir un autre.';
      case 'auth/invalid-email':
        return 'Format d\'email invalide.';
      case 'auth/operation-not-allowed':
        return 'La création de compte est temporairement désactivée.';
      case 'auth/weak-password':
        return 'Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.';
      default:
        return 'Une erreur est survenue lors de la création du compte.';
    }
  }
  return 'Une erreur inattendue est survenue.';
};

export const createSuperAdmin = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    const userData: User = {
      id: userCredential.user.uid,
      email,
      role: 'super_admin',
      firstName,
      lastName,
      isFirstLogin: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    await markSuperAdminCreated();

    return userData;
  } catch (error) {
    console.error('Erreur lors de la création du super admin:', error);
    throw new Error(getErrorMessage(error));
  }
};