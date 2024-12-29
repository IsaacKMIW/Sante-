import { doc, getDoc, collection, query, where, getDocs, setDoc, DocumentReference, onSnapshot } from 'firebase/firestore';
import { db, auth, getSecondaryAuth } from '../../config/firebase';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, deleteUser as deleteFirebaseUser } from 'firebase/auth';
import { User } from '../../types';

// Constantes pour les messages d'erreur
const ERROR_MESSAGES = {
  EMAIL_EXISTS: 'Un utilisateur avec cet email existe déjà',
  AUTH_REQUIRED: 'Vous devez être connecté pour créer un utilisateur',
  CREATION_ERROR: 'Erreur lors de la création de l\'utilisateur',
  INVALID_HOSPITAL: 'Hôpital invalide ou inactif'
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email.toLowerCase());
    if (methods.length > 0) {
      throw new Error(ERROR_MESSAGES.EMAIL_EXISTS);
    }
    return false;
  } catch (error) {
    if (error instanceof Error && error.message === ERROR_MESSAGES.EMAIL_EXISTS) {
      throw error;
    }
    return false;
  }
};

export const validateHospitalStatus = async (hospitalId: string): Promise<void> => {
  const hospitalDoc = await getDoc(doc(db, 'hospitals', hospitalId));
  if (!hospitalDoc.exists() || !hospitalDoc.data().isActive) {
    throw new Error(ERROR_MESSAGES.INVALID_HOSPITAL);
  }
};

export const createUser = async (userData: Partial<User> & { password: string }): Promise<User> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error(ERROR_MESSAGES.AUTH_REQUIRED);
    }

    // Validation complète avant création
    await validateUserData(userData);
    await validateHospitalStatus(userData.hospitalId!);
    const emailExists = await checkEmailExists(userData.email!);
    if (emailExists) {
      throw new Error(ERROR_MESSAGES.EMAIL_EXISTS);
    }

    let userCredential;
    const secondaryAuth = getSecondaryAuth();

    try {
      userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        userData.email!,
        userData.password
      );

      // Créer le document utilisateur
      const newUser: User = {
        id: userCredential.user.uid,
        email: userData.email!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        role: userData.role!,
        hospitalId: userData.hospitalId!,
        status: 'active',
        hospitalName: userData.hospitalName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', newUser.id), newUser);

      return newUser;
    } catch (error: any) {
      if (error instanceof Error && error.message.includes('email-already-in-use')) {
        throw new Error('EMAIL_EXISTS');
      }
      throw error;
    } finally {
      // Toujours se déconnecter de l'auth secondaire
      await secondaryAuth.signOut();
    }
  } catch (error: any) {
    throw new Error(error instanceof Error ? error.message : ERROR_MESSAGES.CREATION_ERROR);
  }
};

export const fetchAllUsers = async (): Promise<User[]> => {
  const usersQuery = query(
    collection(db, 'users'),
    where('role', '!=', 'super_admin')
  );

  const snapshot = await getDocs(usersQuery);
  const users = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt || new Date().toISOString()
  })) as User[];

  // Sort by creation date, newest first
  return users.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const fetchUserById = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } as User : null;
};

export const validateUserData = async (userData: Partial<User> & { password?: string }): Promise<void> => {
  const requiredFields = {
    email: 'Email requis',
    firstName: 'Prénom requis',
    lastName: 'Nom requis',
    role: 'Rôle requis',
    hospitalId: 'Hôpital requis'
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!userData[field as keyof typeof userData]) {
      throw new Error(message);
    }
  }

  if (!userData.id && (!userData.password || userData.password.length < 6)) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
  }
};

export const subscribeToUsersUpdates = (
  hospitalId: string,
  callback: (users: User[]) => void
): () => void => {
  const usersQuery = query(
    collection(db, 'users'),
    where('hospitalId', '==', hospitalId),
    where('role', '!=', 'super_admin')
  );

  return onSnapshot(usersQuery, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
    callback(users.sort((a, b) => 
      new Date(b.createdAt).getTime() - 
      new Date(a.createdAt).getTime()
    ));
  });
};

export const deleteUserCompletely = async (userId: string): Promise<void> => {
  try {
    // 1. Récupérer les données de l'utilisateur
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('Utilisateur non trouvé');
    }

    // 2. Se connecter avec l'auth secondaire pour supprimer l'utilisateur Firebase
    const secondaryAuth = getSecondaryAuth();
    try {
      // Supprimer l'utilisateur Firebase
      await deleteFirebaseUser(secondaryAuth.currentUser!);
    } catch (error) {
      console.error('Erreur lors de la suppression Firebase:', error);
      // Continuer même si la suppression Firebase échoue
    } finally {
      // Toujours se déconnecter de l'auth secondaire
      await secondaryAuth.signOut();
    }

    // 3. Supprimer les données associées
    const batch = db.batch();

    // Supprimer le document utilisateur
    batch.delete(doc(db, 'users', userId));

    // Supprimer les autres données liées (cartes RFID, etc.)
    const rfidQuery = query(
      collection(db, 'rfidCards'),
      where('userId', '==', userId)
    );
    const rfidDocs = await getDocs(rfidQuery);
    rfidDocs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Exécuter toutes les suppressions en une seule transaction
    await batch.commit();

  } catch (error) {
    console.error('Erreur lors de la suppression complète:', error);
    throw new Error('Erreur lors de la suppression de l\'utilisateur');
  }
};