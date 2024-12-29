import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { useReceptionistStore } from '../../../lib/store/receptionistStore';
import { formatDate } from '../../../lib/utils/dateUtils';

const statusStyles = {
  scheduled: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
};

export default function AppointmentsList() {
  const { todayAppointments } = useReceptionistStore();

  if (todayAppointments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Aucun rendez-vous aujourd'hui
      </div>
    );
  }

  return (
    <div className="flow-root mt-4">
      <ul className="-my-5 divide-y divide-gray-200">
        {todayAppointments.map((appointment) => (
          <li key={appointment.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {appointment.patientName}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>Dr. {appointment.doctorName}</span>
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusStyles[appointment.status]
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}