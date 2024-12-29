import React from 'react';
import { User, Clock, ArrowRight } from 'lucide-react';
import { useReceptionistStore } from '../../../lib/store/receptionistStore';
import { formatDate } from '../../../lib/utils/dateUtils';

export default function PatientQueue() {
  const { queuedPatients } = useReceptionistStore();

  if (queuedPatients.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Aucun patient en attente
      </div>
    );
  }

  return (
    <div className="flow-root mt-4">
      <ul className="-my-5 divide-y divide-gray-200">
        {queuedPatients.map((patient) => (
          <li key={patient.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {patient.firstName} {patient.lastName}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>En attente depuis {formatDate(patient.arrivalTime)}</span>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Diriger
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}