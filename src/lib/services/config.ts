import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AppConfig } from '../../types';

const CONFIG_DOC_ID = 'app_config';

export const getAppConfig = async (): Promise<AppConfig | null> => {
  try {
    const configDoc = await getDoc(doc(db, 'config', CONFIG_DOC_ID));
    if (!configDoc.exists()) {
      return null;
    }
    return configDoc.data() as AppConfig;
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error);
    throw error;
  }
};

export const initializeAppConfig = async (): Promise<AppConfig> => {
  const config: AppConfig = {
    id: CONFIG_DOC_ID,
    isInitialized: false,
    superAdminCreated: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'config', CONFIG_DOC_ID), config);
  return config;
};

export const markSuperAdminCreated = async (): Promise<void> => {
  await setDoc(
    doc(db, 'config', CONFIG_DOC_ID),
    {
      superAdminCreated: true,
      isInitialized: true,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};