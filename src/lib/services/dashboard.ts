import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { DashboardStats, Notification } from '../../types';

export const subscribeToDashboardStats = (callback: (stats: DashboardStats) => void): () => void => {
  const unsubscribers: (() => void)[] = [];

  // Surveillance des hôpitaux
  const hospitalsQuery = query(collection(db, 'hospitals'));
  const hospitalsUnsubscribe = onSnapshot(hospitalsQuery, (snapshot) => {
    const activeHospitals = snapshot.docs.filter(doc => doc.data().isActive).length;
    const totalHospitals = snapshot.docs.length;
    const newHospitals = snapshot.docs.filter(doc => {
      const createdAt = new Date(doc.data().createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdAt > thirtyDaysAgo;
    }).length;

    callback({
      hospitals: {
        total: totalHospitals,
        active: activeHospitals,
        new: newHospitals
      }
    });
  });
  unsubscribers.push(hospitalsUnsubscribe);

  // Surveillance des utilisateurs
  const usersQuery = query(
    collection(db, 'users'),
    where('role', '!=', 'super_admin')
  );
  const usersUnsubscribe = onSnapshot(usersQuery, (snapshot) => {
    const usersByRole = snapshot.docs.reduce((acc, doc) => {
      const role = doc.data().role;
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const activeUsers = snapshot.docs.filter(doc => 
      doc.data().status === 'active' || !doc.data().status
    ).length;

    callback({
      users: {
        total: snapshot.docs.length,
        byRole: usersByRole,
        active: activeUsers
      }
    });
  });
  unsubscribers.push(usersUnsubscribe);

  // Surveillance des cartes RFID
  const rfidQuery = query(collection(db, 'rfidCards'));
  const rfidUnsubscribe = onSnapshot(rfidQuery, (snapshot) => {
    callback({
      rfidCards: {
        total: snapshot.docs.length,
        active: snapshot.docs.filter(doc => doc.data().isActive).length
      }
    });
  });
  unsubscribers.push(rfidUnsubscribe);

  return () => unsubscribers.forEach(unsubscribe => unsubscribe());
};

export const subscribeToNotifications = (callback: (notifications: Notification[]) => void): () => void => {
  const notificationsQuery = query(
    collection(db, 'notifications'),
    where('status', '==', 'unread')
  );

  return onSnapshot(notificationsQuery, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];

    callback(notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  });
};