import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import StatisticsGrid from './StatisticsGrid';
import NotificationsPanel from './NotificationsPanel';
import { useAuthStore } from '../../lib/store/authStore';
import { useDashboardStore } from '../../lib/store/dashboardStore';

export default function SuperAdminDashboard() {
  const { user } = useAuthStore();
  const { initializeDashboard, cleanup } = useDashboardStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    initializeDashboard();
    return () => cleanup();
  }, [initializeDashboard, cleanup]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Tableau de bord
            </h1>
            <StatisticsGrid onHospitalClick={() => navigate('/hospitals')} />
            <div className="mt-6">
              <NotificationsPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}