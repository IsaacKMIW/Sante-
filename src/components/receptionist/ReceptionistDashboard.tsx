import React, { useEffect } from 'react';
import ReceptionistLayout from './layout/ReceptionistLayout';
import StatisticsGrid from './dashboard/StatisticsGrid';
import AppointmentsList from './appointments/AppointmentsList';
import PatientQueue from './patients/PatientQueue';
import NotificationsPanel from './notifications/NotificationsPanel';
import { useReceptionistStore } from '../../lib/store/receptionistStore';

export default function ReceptionistDashboard() {
  const { initialize, cleanup } = useReceptionistStore();

  useEffect(() => {
    initialize();
    return () => cleanup();
  }, [initialize, cleanup]);

  return (
    <ReceptionistLayout>
      <div className="space-y-6">
        <StatisticsGrid />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">
                File d'attente des patients
              </h2>
              <PatientQueue />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">
                Prochains rendez-vous
              </h2>
              <AppointmentsList />
            </div>
          </div>
        </div>

        <div>
          <NotificationsPanel />
        </div>
      </div>
    </ReceptionistLayout>
  );
}