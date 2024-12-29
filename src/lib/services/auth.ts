import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { User } from '../../types';
import { useAuthStore } from '../store/authStore';
import { Role } from '../../types';

const ROLE_ROUTES: Record<Role, string> = {
  super_admin: '/dashboard',
  admin_hospital: '/hospital-admin',
  doctor: '/doctor',
  nurse: '/nurse',
  receptionist: '/receptionist',
  patient: '/patient'
};

const createUserDocument = async (uid: string, email: string): Promise<User> => {
  const userData: User = {
    id: uid,
    email: email,
    role: 'patient', // Default role
    firstName: '',
    lastName: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'users', uid), userData);
  return userData;
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = await getUserData(userCredential.user.uid);
    
    if (!user.role) {
      throw new Error('Rôle utilisateur non défini');
    }
    
    if (!ROLE_ROUTES[user.role]) {
      throw new Error('Type de compte non reconnu');
    }
    
    return user;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    if (error instanceof Error) {
      if (error.message.includes('user-not-found')) {
        throw new Error('Aucun compte trouvé avec cet email');
      } else if (error.message.includes('wrong-password')) {
        throw new Error('Mot de passe incorrect');
      } else if (error.message.includes('invalid-email')) {
        throw new Error('Format d\'email invalide');
      } else {
        throw new Error(error.message);
      }
    }
    throw new Error('Échec de la connexion. Veuillez vérifier vos identifiants.');
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    useAuthStore.getState().setUser(null);
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    throw new Error('Une erreur est survenue lors de la déconnexion.');
  }
};

export const getUserData = async (uid: string): Promise<User> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) {
    // If the user document doesn't exist in Firestore, get the email from auth
    const authUser = auth.currentUser;
    if (!authUser?.email) {
      throw new Error('Données utilisateur introuvables.');
    }
    // Create a new user document
    return createUserDocument(uid, authUser.email);
  }
  return userDoc.data() as User;
};

export const initializeAuthListener = (): (() => void) => {
  const { setUser, setLoading } = useAuthStore.getState();

  return onAuthStateChanged(auth, async (firebaseUser) => {
    setLoading(true);
    try {
      if (firebaseUser) {
        const userData = await getUserData(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      setUser(null);
    }
    setLoading(false);
  });
};

export const getRedirectPath = (role: Role): string => {
  return ROLE_ROUTES[role] || '/';
};