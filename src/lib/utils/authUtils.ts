import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../config/firebase';

export const getSecondaryAuth = () => {
  const secondaryApp = getApps().length < 2
    ? initializeApp(firebaseConfig, 'secondary')
    : getApps()[1];
  
  return getAuth(secondaryApp);
};