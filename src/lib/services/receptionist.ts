import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Patient, Appointment, Message } from '../../types/receptionist';

// Fonction utilitaire pour obtenir le début et la fin de la journée
const getDayBounds = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

export const subscribeToAppointments = (callback: (appointments: Appointment[]) => void): (() => void) => {
  const { start, end } = getDayBounds();
  
  const appointmentsQuery = query(
    collection(db, 'appointments'),
    where('date', '>=', Timestamp.fromDate(start)),
    where('date', '<', Timestamp.fromDate(end))
  );

  return onSnapshot(appointmentsQuery, (snapshot) => {
    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];

    callback(appointments.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
  });
};

export const subscribeToPatientQueue = (callback: (patients: Patient[]) => void): (() => void) => {
  const { start, end } = getDayBounds();
  
  const queueQuery = query(
    collection(db, 'patientQueue'),
    where('arrivalTime', '>=', Timestamp.fromDate(start)),
    where('arrivalTime', '<', Timestamp.fromDate(end))
  );

  return onSnapshot(queueQuery, (snapshot) => {
    const patients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Patient[];

    callback(patients.sort((a, b) => 
      new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime()
    ));
  });
};

export const subscribeToMessages = (callback: (messages: Message[]) => void): (() => void) => {
  const messagesQuery = query(
    collection(db, 'messages'),
    where('type', 'in', ['chat', 'announcement'])
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[];

    callback(messages.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  });
};