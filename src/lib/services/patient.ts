import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { PatientBase, PatientMedicalData, PatientAuditLog, PatientSearchFilters } from '../../types/patient';

// Vérification de l'existence d'un patient
export const checkPatientExists = async (
  identifiers: { email?: string; rfidCardId?: string; phone?: string }
): Promise<{ exists: boolean; patient?: PatientBase }> => {
  const conditions = [];
  
  if (identifiers.email) {
    conditions.push(where('email', '==', identifiers.email));
  }
  if (identifiers.rfidCardId) {
    conditions.push(where('rfidCardId', '==', identifiers.rfidCardId));
  }
  if (identifiers.phone) {
    conditions.push(where('phone', '==', identifiers.phone));
  }

  for (const condition of conditions) {
    const q = query(collection(db, 'patients'), condition);
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const patient = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      } as PatientBase;
      return { exists: true, patient };
    }
  }

  return { exists: false };
};

// Création d'un nouveau patient
export const createPatient = async (
  patientData: Omit<PatientBase, 'id' | 'createdAt' | 'updatedAt'>,
  medicalData?: PatientMedicalData
): Promise<PatientBase> => {
  // Vérifier les doublons
  const existingPatient = await checkPatientExists({
    email: patientData.email,
    rfidCardId: patientData.rfidCardId,
    phone: patientData.phone
  });

  if (existingPatient.exists) {
    throw new Error('Un patient avec ces informations existe déjà');
  }

  const timestamp = serverTimestamp();
  const patientRef = doc(collection(db, 'patients'));
  
  const newPatient: PatientBase = {
    ...patientData,
    id: patientRef.id,
    createdAt: timestamp.toString(),
    updatedAt: timestamp.toString()
  };

  await setDoc(patientRef, newPatient);

  // Si des données médicales sont fournies, les enregistrer
  if (medicalData) {
    await setDoc(doc(db, 'patientMedicalData', patientRef.id), {
      ...medicalData,
      patientId: patientRef.id,
      updatedAt: timestamp
    });
  }

  return newPatient;
};

// Recherche de patients avec filtres
export const searchPatients = async (
  filters: PatientSearchFilters
): Promise<PatientBase[]> => {
  let q = collection(db, 'patients');
  const conditions = [];

  // Filtre par hôpital si ce n'est pas une recherche globale
  if (!filters.isGlobalSearch && filters.hospitalId) {
    conditions.push(where('originHospitalId', '==', filters.hospitalId));
  }

  // Filtre par statut
  if (filters.status) {
    conditions.push(where('status', '==', filters.status));
  }

  // Filtre par date
  if (filters.dateRange) {
    conditions.push(
      where('createdAt', '>=', Timestamp.fromDate(new Date(filters.dateRange.start))),
      where('createdAt', '<=', Timestamp.fromDate(new Date(filters.dateRange.end)))
    );
  }

  // Appliquer les conditions
  if (conditions.length > 0) {
    q = query(q, ...conditions);
  }

  const snapshot = await getDocs(q);
  const patients = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as PatientBase[];

  // Filtre textuel local si une requête est spécifiée
  if (filters.query) {
    const searchQuery = filters.query.toLowerCase();
    return patients.filter(patient =>
      patient.firstName.toLowerCase().includes(searchQuery) ||
      patient.lastName.toLowerCase().includes(searchQuery) ||
      patient.email?.toLowerCase().includes(searchQuery) ||
      patient.phone.includes(searchQuery)
    );
  }

  return patients;
};

// Journalisation des accès et modifications
export const logPatientAccess = async (
  patientId: string,
  userId: string,
  userRole: string,
  hospitalId: string,
  action: PatientAuditLog['action'],
  details?: string
): Promise<void> => {
  const logRef = doc(collection(db, 'patientAuditLogs'));
  const timestamp = serverTimestamp();

  await setDoc(logRef, {
    id: logRef.id,
    patientId,
    userId,
    userRole,
    hospitalId,
    action,
    timestamp,
    details
  });
};