import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyD5x8C334wRGCXGqtlay_LC6asqmkjF5K4",
  authDomain: "santeplus-72483.firebaseapp.com",
  projectId: "santeplus-72483",
  storageBucket: "santeplus-72483.firebasestorage.app",
  messagingSenderId: "704587305677",
  appId: "1:704587305677:web:39f4e75ca0b1d081540f84",
  measurementId: "G-DZ0MXMYK3Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure la persistence pour l'auth principale
setPersistence(auth, browserLocalPersistence);

// Fonction pour obtenir une instance d'auth secondaire
export const getSecondaryAuth = () => {
  const secondaryApp = getApps().length < 2
    ? initializeApp(firebaseConfig, 'secondary')
    : getApps()[1];
  
  return getAuth(secondaryApp);
};