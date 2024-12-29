import React from 'react';
import { Users, Calendar, Bell } from 'lucide-react';
import { useReceptionistStore } from '../../../lib/store/receptionistStore';

export default function StatisticsGrid() {
  const { todayStats } = useReceptionistStore();

  const stats = [
    {
      id: 1,
      name: 'Patients aujourd\'hui',
      value: todayStats.totalPatients,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Rendez-vous à venir',
      value: todayStats.upcomingAppointments,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      id: 3,
      name: 'Notifications',
      value: todayStats.unreadNotifications,
      icon: Bell,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}