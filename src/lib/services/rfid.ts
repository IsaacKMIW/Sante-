import { collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { RFIDCard } from '../../types/rfid';

export const validateRFIDCard = async (uid: string, hospitalId: string): Promise<boolean> => {
  const q = query(
    collection(db, 'rfidCards'),
    where('uid', '==', uid),
    where('isActive', '==', true)
  );

  const snapshot = await getDocs(q);
  return snapshot.empty;
};

export const createRFIDCard = async (
  uid: string,
  hospitalId: string,
  patientId?: string
): Promise<RFIDCard> => {
  const isValid = await validateRFIDCard(uid, hospitalId);
  if (!isValid) {
    throw new Error('Cette carte RFID est déjà associée à un patient');
  }

  const cardData: Omit<RFIDCard, 'id'> = {
    uid,
    hospitalId,
    patientId,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'rfidCards'), cardData);
  return { id: docRef.id, ...cardData };
};