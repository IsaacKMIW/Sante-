import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword as updateFirebasePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { useAuthStore } from '../store/authStore';

export const updateProfile = async (data: { firstName: string; lastName: string }) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    // Mettre à jour le store local
    const { setUser } = useAuthStore.getState();
    setUser({
      ...(useAuthStore.getState().user || {}),
      ...data,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw new Error('Erreur lors de la mise à jour du profil');
  }
};

export const updatePassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;
  if (!user?.email) {
    throw new Error('Utilisateur non connecté');
  }

  try {
    // Réauthentifier l'utilisateur
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Mettre à jour le mot de passe
    await updateFirebasePassword(user, newPassword);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    if (error instanceof Error && error.message.includes('wrong-password')) {
      throw new Error('Mot de passe actuel incorrect');
    }
    throw new Error('Erreur lors de la mise à jour du mot de passe');
  }
};