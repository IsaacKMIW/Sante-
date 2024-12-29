import React from 'react';
import { Building2, Users, CreditCard, Stethoscope } from 'lucide-react';
import { useDashboardStore } from '../../lib/store/dashboardStore';

interface StatisticsGridProps {
  onHospitalClick: () => void;
}

export default function StatisticsGrid({ onHospitalClick }: StatisticsGridProps) {
  const { stats } = useDashboardStore();

  const statItems = [
    {
      id: 1,
      name: 'Hôpitaux',
      value: stats.hospitals.total.toString(),
      icon: Building2,
      change: `${stats.hospitals.active} actifs`,
      changeType: 'increase',
      onClick: onHospitalClick,
    },
    {
      id: 2,
      name: 'Personnel médical',
      value: stats.users.total.toString(),
      icon: Users,
      change: Object.entries(stats.users.byRole)
        .map(([role, count]) => {
          switch(role) {
            case 'doctor': return `${count} médecins`;
            case 'nurse': return `${count} infirmiers`;
            case 'receptionist': return `${count} réceptionnistes`;
            case 'admin_hospital': return `${count} admins`;
            default: return '';
          }
        })
        .filter(Boolean)
        .join(', '),
      changeType: 'increase',
    },
    {
      id: 3,
      name: 'Cartes RFID',
      value: stats.rfidCards.total.toString(),
      icon: CreditCard,
      change: `${stats.rfidCards.active} actives`,
      changeType: 'increase',
    },
    {
      id: 4,
      name: 'Consultations',
      value: '42,589',
      icon: Stethoscope,
      change: '+12%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <button
          key={stat.id}
          onClick={stat.onClick}
          className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden w-full text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <dt>
            <div className="absolute bg-blue-500 rounded-md p-3">
              <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 text-sm font-medium text-gray-500 truncate">
              {stat.name}
            </p>
          </dt>
          <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                stat.changeType === 'increase'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {stat.change}
            </p>
          </dd>
        </button>
      ))}
    </div>
  );
}