import React from 'react';
import { BedDouble } from 'lucide-react';
import ReceptionistLayout from '../layout/ReceptionistLayout';

export default function AdmissionsPage() {
  return (
    <ReceptionistLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <BedDouble className="h-6 w-6 mr-2" />
            Gestion des Admissions
          </h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500 text-center">
            Module de gestion des admissions en cours de développement...
          </p>
        </div>
      </div>
    </ReceptionistLayout>
  );
}